
from django.dispatch import receiver
from user_auth.models import CustomUser
from django.db import models
from django.contrib.auth.models import Permission
from django.db.models.signals import post_save
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Project(models.Model):

    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed'),
        ('pending_approval', 'Pending Approval'),
        ('under_review', 'Under Review'),
        ('needs_attention', 'Needs Attention'),
    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='not_started')    
    roles = models.ManyToManyField('Role', blank=True, related_name='projects')
    users = models.ManyToManyField(CustomUser,through='ProjectUserRole', blank=True, related_name='projects')

    
    def __str__(self):
        return self.title
    
    class Meta:
        permissions = [
            ("add_task", "Can add task"),
            ("delete_task", "Can delete task"),
            ("delete_members", "Can delete members from project"),
            ("add_members", "Can add members to project"),
            ("can_delete_project", "Can delete project"),
            ("can_add_role", "Can add role to project"),
        ]


    


class Role(models.Model):
    name = models.CharField(max_length=100)
    permissions = models.ManyToManyField(
        Permission,
        blank=True,
        limit_choices_to={'content_type__app_label': 'projects'}, 
    )
    def __str__(self):
        return self.name


class ProjectUserRole(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.project.title} - {self.role.name}"  
    
@receiver(post_save, sender=Project)
def create_default_roles(sender, instance, created, **kwargs):
    if created and not instance.roles.exists():
        # Create ADMIN and OWNER roles as default for each project
        admin_role, created = Role.objects.get_or_create(name="Admin")
        owner_role, created = Role.objects.get_or_create(name="Owner")

        owner_permissions = Permission.objects.all()  
        admin_permissions = Permission.objects.filter(codename__in=['add_task', 'add_members', 'delete_task'])
        admin_role.permissions.set(admin_permissions)
        owner_role.permissions.set(owner_permissions)

        instance.roles.add(admin_role, owner_role)

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateField()
    status = models.CharField(max_length=100)
    users = models.ManyToManyField(CustomUser, blank=True, related_name='assigned_tasks')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    
    def delete_check(self, user):
        return ( user in self.project.users.all() and user.has_perm("delete_task", self.project))
    
    def delete(self, using=None, keep_parents=False, user=None):
        if not self.delete_check(user):
            raise PermissionDenied("You do not have permission to delete this task.")
        super().delete(using=using, keep_parents=keep_parents)
    


class Ticket(models.Model):

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]


    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tickets')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_tickets')
    priority = models.CharField(max_length=100, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class Record(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    hours_worked = models.DurationField(null=True, default=None)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    # GenericForeignKey to allow a relation with either Task or Ticket
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def save(self, *args, **kwargs):
        time_diff = self.end_date - self.start_date

        self.hours_worked = time_diff
        super().save(*args, **kwargs)
