from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from user_auth.models import CustomUser
from rest_framework.views import APIView

from .models import ProjectUserRole, Record, Role, Task, Project
from .serializers import ProjectUserRoleSerializer, RecordSerializer, RoleSerializer, TaskSerializer, ProjectSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import Permission
class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (TokenAuthentication,) 
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        user_ids_to_add = request.data.get('users_to_add', [])
        user_ids_to_remove = request.data.get('users_to_remove', [])
        if user_ids_to_add:
            instance.users.add(*user_ids_to_add)

        if user_ids_to_remove:
            instance.users.remove(*user_ids_to_remove)

        instance.save()

        # Serialize the updated instance
        serialized_instance = TaskSerializer(instance)

        return Response(data=serialized_instance.data, status=status.HTTP_200_OK)

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
        instance = self.get_object()
        user_role = ProjectUserRole.objects.filter(user=request.user, project=instance).first()

        user_ids_to_add = request.data.get('users_to_add', [])
        user_ids_to_remove = request.data.get('users_to_remove', [])

        if user_ids_to_add and user_role and user_role.role.permissions.filter(codename="add_members").first():
            instance.users.add(*user_ids_to_add)
        elif user_ids_to_add:
            raise PermissionDenied("You do not have permission to add members to this project.")

        if user_ids_to_remove and user_role and user_role.role.permissions.filter(codename="delete_members").first():
            instance.users.remove(*user_ids_to_remove)
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
    


class ProjectUsersView(generics.ListAPIView):
    serializer_class = ProjectUserRoleSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

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
    


class ListPermissionsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    def get(self, request, *args, **kwargs):
        permissions = Permission.objects.all().filter(content_type__app_label='projects')

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