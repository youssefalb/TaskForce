
from django.dispatch import receiver
from user_auth.models import CustomUser
from django.db import models
from django.contrib.auth.models import Permission
from django.db.models.signals import post_save


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
    tasks = models.ManyToManyField('Task', blank=True, related_name='projects')
    roles = models.ManyToManyField('Role', blank=True, related_name='projects')

    users = models.ManyToManyField(CustomUser, blank=True, related_name='projects')

    
    def __str__(self):
        return self.title
    
    class Meta:
        permissions = [
            ("add_task", "Can add task"),
            ("delete_task", "Can delete task"),
            ("add_members", "Can add members to project"),
            ("can_delete_project", "Can delete project"),
        ]
    


class Role(models.Model):
    name = models.CharField(max_length=100)
    permissions = models.ManyToManyField(Permission, blank=True)

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
    
