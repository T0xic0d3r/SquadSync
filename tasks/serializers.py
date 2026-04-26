from rest_framework import serializers
from .models import Task, TaskProof, TaskComment


class TaskProofSerializer(serializers.ModelSerializer):
    rejectionReason = serializers.CharField(source='rejection_reason', read_only=True)

    class Meta:
        model = TaskProof
        fields = ['id', 'type', 'url', 'caption', 'status', 'rejectionReason', 'submitted_at']


class TaskCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    userId = serializers.IntegerField(source='user.id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = TaskComment
        fields = ['id', 'user', 'userId', 'content', 'createdAt']
        read_only_fields = ['user', 'userId', 'createdAt']

    def get_user(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return {'id': obj.user.id, 'name': full or obj.user.username}


class TaskSerializer(serializers.ModelSerializer):
    assignedTo = serializers.IntegerField(source='assigned_to_id', required=False, allow_null=True)
    assignedBy = serializers.IntegerField(source='created_by_id', read_only=True)
    assignedUser = serializers.SerializerMethodField()
    proof = TaskProofSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'assignedTo', 'assignedBy', 'assignedUser',
            'deadline', 'score', 'penalty', 'proof',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['assignedBy', 'assignedUser', 'created_at', 'updated_at']

    def get_assignedUser(self, obj):
        if obj.assigned_to:
            full = f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip()
            return {'id': obj.assigned_to.id, 'name': full or obj.assigned_to.username}
        return None
