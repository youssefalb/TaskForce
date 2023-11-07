from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from user_auth.models import CustomUser
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q



from .models import ProjectUserRole, Record, Role, Task, Project, Ticket
from .serializers import ProjectUserRoleSerializer, RecordSerializer, RoleSerializer, TaskSerializer, ProjectSerializer, TicketSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import Permission

class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    def create(self, request, *args, **kwargs):
        user_ids = request.data.get("users", [])

        task_data = request.data
        task_serializer = TaskSerializer(data=task_data)

        if task_serializer.is_valid():
            task = task_serializer.save()

            users = CustomUser.objects.filter(id__in=user_ids)
            task.users.set(users)

            return Response(task_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Task.objects.all()
    serializer_class = TaskSerializer



    def perform_destroy(self, instance):
        user = self.request.user
        if not instance.delete_check(user):
            raise PermissionDenied("You do not have permission to delete this task.")
        instance.delete()


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user_ids = request.data.get('users', []) 
        instance.users.set(user_ids)  
        instance.title = request.data.get('title', instance.title)
        instance.description = request.data.get('description', instance.description)
        instance.deadline = request.data.get('deadline', instance.deadline)
        
        if 'status' in request.data:
            instance.status = request.data.get('status', instance.status)
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


    def put(self, request, *args, **kwargs):
        print("Called here")
        instance = self.get_object()
        user_role = ProjectUserRole.objects.filter(user=request.user, project=instance).first()
        print(request.data)
        user_ids_to_add = request.data.get('users_to_add', [])
        user_ids_to_remove = request.data.get('users_to_remove', [])
        role_name = request.data.get('role_name', 'Guest')
        print(user_ids_to_add)
        if user_ids_to_add:
            if  user_role and user_role.role.permissions.filter(codename="add_members").first():
                for user_id in user_ids_to_add:
                    print("user Id: ",user_id)
                    user = CustomUser.objects.get(id=user_id)
                    try:
                        role = Role.objects.get(name=role_name)
                    except Role.DoesNotExist:
                        raise ValueError("Role does not exist.")
                    ProjectUserRole.objects.create(user=user, project=instance, role=role)
                instance.users.add(*user_ids_to_add)

        elif user_ids_to_add:
            raise PermissionDenied("You do not have permission to add members to this project.")

        if user_ids_to_remove and user_role and user_role.role.permissions.filter(codename="delete_members").first():
            instance.users.remove(*user_ids_to_remove)
            print(f"Attempting to remove users with IDs: {user_ids_to_remove}")
            removed_roles = ProjectUserRole.objects.filter(project=instance, user_id__in=user_ids_to_remove)
            print(f"Roles to be removed: {removed_roles.count()}")
            ProjectUserRole.objects.filter(project=instance, user_id__in=user_ids_to_remove).delete()
            print("Removed")
        elif user_ids_to_remove:
            raise PermissionDenied("You do not have permission to remove members from this project.")


        instance.save()

        serialized_instance = ProjectSerializer(instance)
        return Response(data=serialized_instance.data, status=status.HTTP_200_OK)
    

    def delete(self, request, *args, **kwargs):	
        project = self.get_object()

        user_role = ProjectUserRole.objects.filter(user=request.user, project=project).first()
        print(user_role)
        print('Permissions: ', user_role.role.permissions)

        if user_role and user_role.role.permissions.filter(codename="can_delete_project").first():
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        raise PermissionDenied("You do not have permission to delete this project.")
    
class UserProjectsListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(users=user)
    


class ProjectRolesView(generics.ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = RoleSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        # Retrieve roles related to the specified project
        return Role.objects.filter(projects__id=project_id)

class ProjectTicketsView(generics.ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Ticket.objects.filter(project_id=project_id)
class ProjectTasksView(generics.ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Task.objects.filter(project_id=project_id)
    
class ProjectUsersView(generics.ListAPIView):
    serializer_class = ProjectUserRoleSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ProjectUserRoleSerializer
    
    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return ProjectUserRole.objects.filter(project_id=project_id)

class UpdateUserRoleView(generics.RetrieveUpdateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = ProjectUserRole.objects.all()
    serializer_class = ProjectUserRoleSerializer

    def get_object(self):
        project_id = self.kwargs.get('project_id')
        user_id = self.kwargs.get('user_id')
        return get_object_or_404(self.queryset, project_id=project_id, user_id=user_id)
    
class CreateRoleView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        project = get_object_or_404(Project, pk=kwargs['project_id'])
        user_role = ProjectUserRole.objects.filter(user=request.user, project=project).first()
        print(user_role.role.permissions.filter(codename="can_add_role").exists())
        if user_role and user_role.role.permissions.filter(codename="can_add_role").exists():
            serializer = RoleSerializer(data=request.data)
            if serializer.is_valid():
                role = serializer.save()
                project.roles.add(role)
                return Response(data=RoleSerializer(role).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        raise PermissionDenied("You do not have permission to add roles to this project.")

class UpdateRoleView(generics.RetrieveUpdateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]    
    lookup_field = 'id'

class ListPermissionsView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        permissions = Permission.objects.exclude(
            Q(content_type__model='task') & Q(content_type__app_label='projects')
        ).filter(content_type__app_label='projects')
        permission_data = [
            {
                'id': permission.id,
                'codename': permission.codename,
                'name': permission.name,
            }
            for permission in permissions
        ]
        return Response(data=permission_data, status=status.HTTP_200_OK)


class RecordCreateView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    queryset = Record.objects.all()
    serializer_class = RecordSerializer