from .models import Project, Task
from rest_framework import serializers

# For now include all fields
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

# For now include all fields (Same as ProjectSerializer)
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'