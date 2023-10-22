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

from user_auth.views import UpdateUserDataView, GetUserDataView, LoginView, UserRegistrationView, GoogleLoginView
from projects.views import  ListPermissionsView, ProjectDetailView, ProjectListCreateView, ProjectUsersView, RecordCreateView, TaskDetailView, TaskListCreateView, UpdateUserRoleView, CreateRoleView, UserProjectsListView

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
    path('api/records/create/', RecordCreateView.as_view(), name='create-record'),
    path('api/user/<str:user_id>/projects/', UserProjectsListView.as_view(), name='user-projects-list'),

]