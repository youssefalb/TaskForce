from user_auth.models import CustomUser
from .models import Project, ProjectUserRole, Role, Task
from rest_framework import serializers

# For now include all fields


class ProjectUserRoleSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    role_name = serializers.CharField(source='role.name')
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),  
        write_only=True,
        source='role'
    )
    class Meta:
        model = ProjectUserRole
        fields = ('id', 'user','project',  'user_username', 'role_name', 'role_id')



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

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


