from django.contrib import admin
from .models import TicketComment, Project, Record, Task, Role, ProjectUserRole, Ticket, TicketFile

# class TaskInline(admin.TabularInline):
#     model = Ticket.related_tasks.through
#     extra = 1 
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_date', 'end_date', 'status', )

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'deadline', 'status')

class TicketAdmin(admin.ModelAdmin):
    # model = [TaskInline, ]
    list_display = ('id', 'title', 'description', 'status')

class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  

class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'role', 'project')

class RecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'start_date', 'end_date', 'hours_worked', 'ticket')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'author', 'text', 'created_at')

class TicketFileAdmin(admin.ModelAdmin):

    list_display = ('id', 'ticket',  'name', 'file_url', 'uploaded_at')


admin.site.register(TicketFile, TicketFileAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(ProjectUserRole, UserRoleAdmin)
admin.site.register(Ticket, TicketAdmin)
admin.site.register(Record, RecordAdmin)
admin.site.register(TicketComment, CommentAdmin)
