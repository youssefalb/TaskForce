from django.contrib import admin
from .models import Project, Task, Role, ProjectUserRole

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_date', 'end_date', 'status', )

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'deadline', 'status')

class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  

class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'project')

admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(ProjectUserRole, UserRoleAdmin)
