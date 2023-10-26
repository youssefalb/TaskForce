from user_auth.models import CustomUser
from .models import Project, ProjectUserRole, Record, Role, Task, Ticket
from rest_framework import serializers

# For now include all fields


class ProjectUserRoleSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    image = serializers.CharField(source='user.image', read_only=True)
    role_name = serializers.CharField(source='role.name')
    class Meta:
        model = ProjectUserRole
        fields = ('id', 'user','project',  'username', 'role_name', 'email', 'image')



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'STATUS_CHOICES','title',  'image', 'description', 'start_date', 'end_date', 'status')

    def create(self, validated_data):
        role_owner, _ = Role.objects.get_or_create(name="Owner")
        
        project = Project(**validated_data)

        project.save()

        user = self.context['request'].user
        ProjectUserRole.objects.get_or_create(user=user, project=project, role=role_owner)

        return project
    

# For now include all fields (Same as ProjectSerializer)
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'