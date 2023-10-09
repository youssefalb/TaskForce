
from user_auth.models import CustomUser
from django.db import models

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)
    tasks = models.ManyToManyField('Task', blank=True, related_name='projects')

    users = models.ManyToManyField(CustomUser, blank=True, related_name='projects')


    def __str__(self):
        return self.title
    

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