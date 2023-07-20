
from django.contrib.auth.models import User
from django.db import models

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)

    # I don't have a Task model yet, so I'm commenting this out for now
    # milestones = models.ManyToManyField('Task', blank=True)

    users = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.title
    

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateField()
    status = models.CharField(max_length=100)
    users = models.ManyToManyField(User)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.title