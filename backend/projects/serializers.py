from user_auth.models import CustomUser
from .models import TaskComment, TicketComment, Project, ProjectUserRole, Record, Role, Task, Ticket, TicketFile
from rest_framework import serializers
from django.contrib.auth.models import Permission
# For now include all fields


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

        
class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(many=True, queryset=Permission.objects.all())
    class Meta:
        model = Role
        fields = '__all__'


    def to_representation(self, instance):
        ret = super(RoleSerializer, self).to_representation(instance)
        ret['permissions'] = PermissionSerializer(instance.permissions.all(), many=True).data
        return ret
    

    def update(self, instance, validated_data):
        print(validated_data)
        instance.name = validated_data.get('name', instance.name)
        if 'permissions' in validated_data:
            permissions = validated_data.pop('permissions')
            instance.permissions.set(permissions)

        instance.save()
        return instance




class ProjectUserRoleSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    image = serializers.CharField(source='user.image', read_only=True)
    role_name = serializers.CharField(source='role.name')
    role = RoleSerializer(read_only=True)
    class Meta:
        model = ProjectUserRole
        fields = ('id', 'user','project',  'username', 'role_name', 'email', 'image', 'role')


class ProjectUserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUserRole
        fields = ['role'] 

class ProjectRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name')


class UserBriefDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name',  'username', 'image') 



class TicketFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketFile
        fields = ['id', 'file_url', 'uploaded_at', 'name']

class TicketSerializer(serializers.ModelSerializer):
    assigned_to = UserBriefDataSerializer(read_only=True)
    created_by = UserBriefDataSerializer(read_only=True)
    files = TicketFileSerializer(many=True, read_only=True)
    class Meta:
        model = Ticket
        fields = '__all__'
        extra_kwargs = {
            'project': {'read_only': True},
            'created_by': {'read_only': True},
        }

class TicketUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)  
    class Meta:
        model = Project
        fields = ('id', 'STATUS_CHOICES','title',  'image', 'description', 'start_date', 'end_date', 'status', 'roles')

    def create(self, validated_data):
        role_owner, _ = Role.objects.get_or_create(name="Owner")
        
        project = Project(**validated_data)

        project.save()

        user = self.context['request'].user
        ProjectUserRole.objects.get_or_create(user=user, project=project, role=role_owner)

        return project
    

# For now include all fields (Same as ProjectSerializer)
class TaskUserSerializer(serializers.ModelSerializer):
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'image', 'role_name')

    def get_role_name(self, user):
        project = self.context.get('project')
        role_name = None
        if project:
            try:
                project_user_role = ProjectUserRole.objects.get(user=user, project=project)
                role_name = project_user_role.role.name
            except ProjectUserRole.DoesNotExist:
                pass

        return role_name



class TaskSerializer(serializers.ModelSerializer):
    users = TaskUserSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

    def to_representation(self, instance):
        data = super(TaskSerializer, self).to_representation(instance)
        context = self.context
        context['project'] = instance.project
        print("Called here in the representation")
        users = instance.users.all() 

        user_serializer = TaskUserSerializer(users, many=True, context=context)
        data['users'] = user_serializer.data

        return data


class TicketCommentSerializer(serializers.ModelSerializer):
    author = UserBriefDataSerializer()
    class Meta:
        model = TicketComment
        fields = '__all__'

class TicketCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketComment
        fields = '__all__'


class TaskCommentSerializer(serializers.ModelSerializer):
    author = UserBriefDataSerializer()
    class Meta:
        model = TaskComment
        fields = '__all__'

class TaskCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = '__all__'

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'

