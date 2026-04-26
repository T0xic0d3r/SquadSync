from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)
    created_by = TeamMemberSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'invite_code', 'created_by', 'members', 'member_count', 'created_at']
        read_only_fields = ['invite_code', 'created_by', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()
