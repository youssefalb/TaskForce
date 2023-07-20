from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Project

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_date', 'end_date', 'status')

admin.site.register(Project, ProjectAdmin)