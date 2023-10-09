from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer

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
        task_ids_to_add = request.data.get('tasks_to_add', [])
        task_ids_to_remove = request.data.get('tasks_to_remove', [])

        if user_ids_to_add:
            instance.users.add(*user_ids_to_add)

        if user_ids_to_remove:
            instance.users.remove(*user_ids_to_remove)

        if task_ids_to_add:
            instance.tasks.add(*task_ids_to_add)

        if task_ids_to_remove:
            instance.tasks.remove(*task_ids_to_remove)

        instance.save()

        instance.save()

        # Serialize the updated instance
        serialized_instance = ProjectSerializer(instance)
        return Response(data=serialized_instance.data, status=status.HTTP_200_OK)

    
    
