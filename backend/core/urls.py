"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from user_auth.views import UpdateUserDataView, GetUserDataView, LoginView, UserRegistrationView, GoogleLoginView, activate_account,  send_verification_email_view
from projects.views import  RecordCreateOrUpdateView, TicketFilesView, UpdateTicketRelatedTasks, UserRecordsListView, AllUsersListView, add_ticket_file,delete_ticket_file, TicketTasksView, TaskCommentCreateView, TaskCommentsView, TicketCommentCreateView, ListPermissionsView, ProjectDetailView, ProjectListCreateView, ProjectRolesView, ProjectTicketsView, ProjectUserRoleUpdateView, ProjectUsersView,  TaskDetailView, TicketCommentsView, TicketDetailView, TicketUpdateView, UpdateRoleView,  TaskListCreateView, UpdateUserRoleView, CreateRoleView, UserProjectPermissionsView, UserProjectsListView, ProjectTasksView, TicketCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view()),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/social/login/google/', GoogleLoginView.as_view(), name='google'),
    path('api/user-data/', GetUserDataView.as_view(), name='get_user_data'),
    path('api/user-data/update/', UpdateUserDataView.as_view(), name='update_user_data'),
    path('api/tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('api/tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('api/projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('api/projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('api/project/<int:project_id>/users/', ProjectUsersView.as_view(), name='project-users'),
    path('api/project/<project_id>/user/<user_id>/', UpdateUserRoleView.as_view(), name='update-user-role'),
    path('api/projects/<project_id>/create_role/', CreateRoleView.as_view(), name='create-role'),
    path('list_permissions/', ListPermissionsView.as_view(), name='list_permissions'),
    path('api/user/<str:user_id>/projects/', UserProjectsListView.as_view(), name='user-projects-list'),
    path('api/project/<int:project_id>/tasks/', ProjectTasksView.as_view(), name='project-tasks-list'),
    path('api/project/<int:project_id>/roles/', ProjectRolesView.as_view(), name='project-roles'),
    path('roles/<int:id>/', UpdateRoleView.as_view(), name='update-role'),
    path('activate-account/', activate_account, name='activate-account'),
    path('send-verification-email/<user_id>/', send_verification_email_view, name='send_verification_email'),
    path('projects/<int:project_id>/users/<user_id>/permissions/', UserProjectPermissionsView.as_view(), name='user-project-permissions'),
    path('project-user-role/<int:pk>/', ProjectUserRoleUpdateView.as_view(), name='project-user-role-update'),
    path('projects/<int:project_id>/tickets/', ProjectTicketsView.as_view(), name='project-tickets'),
    path('projects/<int:project_id>/tickets/<int:id>/', TicketDetailView.as_view(), name='project-tickets'),
    path('projects/<int:project_id>/tickets/<int:ticket_id>/comments/', TicketCommentsView.as_view(), name='ticket-comments'),
    path('projects/<int:project_id>/tickets/<int:id>/update/', TicketUpdateView.as_view(), name='ticket-update'),
    path('tickets/<int:ticket_id>/comments/', TicketCommentCreateView.as_view(), name='ticket-comment-create'),
    path('tasks/<int:task_id>/comments/', TaskCommentCreateView.as_view(), name='task-comment-create'),
    path('projects/<int:project_id>/tasks/<int:task_id>/comments/', TaskCommentsView.as_view(), name='task-comments'),
    path('projects/<int:project_id>/tickets/create/', TicketCreateView.as_view(), name='ticket-create'),
    path('tickets/<int:ticket_id>/add-file/', add_ticket_file, name='add_ticket_file'),
    path('tickets/<int:ticket_id>/files/', TicketFilesView.as_view(), name='get-files'),
    path('tickets/files/<int:file_id>/delete/', delete_ticket_file, name='delete_ticket_file'),
    path('tickets/<int:ticket_id>/tasks/', TicketTasksView.as_view(), name='ticket-tasks'),
    path('tickets/<int:ticket_id>/update-related-tasks/', UpdateTicketRelatedTasks.as_view(), name='update_ticket_related_tasks'),
    path('records/', RecordCreateOrUpdateView.as_view(), name='record-create-or-update'),
    path('my-records/', UserRecordsListView.as_view(), name='user-records'),
    path('users/', AllUsersListView.as_view(), name='all-users'),
    
]