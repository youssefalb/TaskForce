from django.contrib import admin
from .models import Comment, Project, Record, Task, Role, ProjectUserRole, Ticket

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_date', 'end_date', 'status', )

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'deadline', 'status')

class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'status')

class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  

class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'role', 'project')

class RecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'start_date', 'end_date', 'hours_worked', 'content_type', 'object_id', 'content_object')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'author', 'text', 'created_at')




admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(ProjectUserRole, UserRoleAdmin)
admin.site.register(Ticket, TicketAdmin)
admin.site.register(Record, RecordAdmin)
admin.site.register(Comment, CommentAdmin)
