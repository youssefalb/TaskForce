from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Project , Task

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_date', 'end_date', 'status')

admin.site.register(Project, ProjectAdmin)

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'deadline', 'status')

admin.site.register(Task, TaskAdmin)