from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from user_auth.models import CustomUser

from .models import ProjectUserRole, Role, Task, Project
from .serializers import ProjectUserRoleSerializer, TaskSerializer, ProjectSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
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
        user_ids_to_add = request.data.get('users_to_add', [])
        user_ids_to_remove = request.data.get('users_to_remove', [])

        if user_ids_to_add:
            instance.users.add(*user_ids_to_add)

        if user_ids_to_remove:
            instance.users.remove(*user_ids_to_remove)



        instance.save()

        serialized_instance = ProjectSerializer(instance)
        return Response(data=serialized_instance.data, status=status.HTTP_200_OK)
    


class ProjectUsersView(generics.ListAPIView):
    serializer_class = ProjectUserRoleSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return ProjectUserRole.objects.filter(project_id=project_id)

class UpdateUserRoleView(generics.UpdateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = ProjectUserRole.objects.all()
    serializer_class = ProjectUserRoleSerializer
    lookup_url_kwarg = 'user_id'    
    
