from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from user_auth.models import CustomUser
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated

from .models import ProjectUserRole, Record, Role, Task, Project, TaskComment, Ticket, TicketComment, TicketFile
from .serializers import TaskCommentCreateSerializer, TaskCommentSerializer, TicketCommentCreateSerializer, TicketCommentSerializer, PermissionSerializer, ProjectUserRoleSerializer, ProjectUserRoleUpdateSerializer, RecordSerializer, RoleSerializer, TaskSerializer, ProjectSerializer, TicketFileSerializer, TicketSerializer, TicketUpdateSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import Permission
from user_auth.serializers import CustomUserSerializer

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
        user_ids = request.data.get('users', instance.users.all()) 
        instance.users.set(user_ids)  
        instance.title = request.data.get('title', instance.title)
        instance.description = request.data.get('description', instance.description)
        instance.deadline = request.data.get('deadline', instance.deadline)
        print("Instance Data: ", instance.users)

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
        if user_ids_to_add and user_role and user_role.role.permissions.filter(codename="add_members").first():
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
    
class UserProjectPermissionsView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, project_id, user_id):
        project_user_role = get_object_or_404(ProjectUserRole, user_id=user_id, project_id=project_id)

        role_permissions = project_user_role.role.permissions.all()
        permissions_serializer = PermissionSerializer(role_permissions, many=True)
        # print(permissions_serializer.data)
        return Response(permissions_serializer.data)

class ProjectRolesView(generics.ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = RoleSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Role.objects.filter(projects__id=project_id)
    

class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    lookup_field = 'id'

class TicketUpdateView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Ticket.objects.all()
    serializer_class = TicketUpdateSerializer
    lookup_field = 'id'

class TicketCreateView(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        print(project_id)
        project = Project.objects.get(id=project_id)
        serializer.save(project=project, created_by=self.request.user)

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
    
class TicketCommentsView(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketCommentSerializer

    def get_queryset(self):
        ticket_id = self.kwargs['ticket_id']
        return TicketComment.objects.filter(ticket_id=ticket_id)
    
class TicketCommentCreateView(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketCommentCreateSerializer


class TaskCommentsView(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TaskCommentSerializer

    def get_queryset(self):
        task_id = self.kwargs['task_id']
        return TaskComment.objects.filter(task_id=task_id)
    
class TaskCommentCreateView(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TaskCommentCreateSerializer
    
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

class UpdateRoleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]    
    lookup_field = 'id'

class ProjectUserRoleUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]    
    queryset = ProjectUserRole.objects.all()
    serializer_class = ProjectUserRoleUpdateSerializer

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


class TicketFilesView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = TicketFileSerializer

    def get_queryset(self):
        ticket_id = self.kwargs['ticket_id']
        return TicketFile.objects.filter(ticket_id=ticket_id)    




@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_ticket_file(request, ticket_id):
    print("Request: ", request.data )
    file_url = request.data.get('file_url')
    name = request.data.get('name')
    if not file_url:
        return Response({'error': 'File URL is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Find the ticket and add the file
    ticket = Ticket.objects.get(id=ticket_id)
    ticket_file = TicketFile.objects.create(ticket=ticket, file_url=file_url , name=name)
    return Response(TicketFileSerializer(ticket_file).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def delete_ticket_file(request, file_id):
    if not file_id:
        return Response({'error': 'File ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    ticket_file = TicketFile.objects.get(id=file_id)
    ticket_file.delete()
    return Response(TicketFileSerializer(ticket_file).data ,status=status.HTTP_204_NO_CONTENT)


class TicketTasksView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    
    def get(self, request, ticket_id):
        try:
            ticket = Ticket.objects.get(pk=ticket_id)
            tasks = ticket.related_tasks.all()
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateTicketRelatedTasks(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    
    def post(self, request, ticket_id):
        try:
            ticket = Ticket.objects.get(pk=ticket_id)
            task_ids = request.data.get('task_ids', [])  
            tasks = Task.objects.filter(pk__in=task_ids)
            
            ticket.related_tasks.clear()
            ticket.related_tasks.add(*tasks)
            
            return Response({"message": "Related tasks updated successfully"}, status=status.HTTP_200_OK)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
        


class RecordCreateOrUpdateView(generics.CreateAPIView):
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def create(self, request, *args, **kwargs):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        ticket_id = request.data.get('ticket')
        notes = request.data.get('notes')
        # print the valuse above
        ticket_instance = None
        if ticket_id:
            try:
                ticket_instance = Ticket.objects.get(id=ticket_id)
            except Ticket.DoesNotExist:
                return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

        request.data['user'] = request.user.id
        record, created = Record.objects.get_or_create(
            user=request.user,
            start_date=start_date,
            end_date=end_date,
            ticket=ticket_instance ,
            notes=notes

        )

        if not created:
            serializer = self.get_serializer(record, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            # Create a new record
            serializer = self.get_serializer(record)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RecordDeleteView(generics.DestroyAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

class UserRecordsListView(generics.ListAPIView):
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        return Record.objects.filter(user_id=self.request.user)
    
class AllUsersListView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        return CustomUser.objects.all()