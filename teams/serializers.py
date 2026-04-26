from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'username', 'email', 'name', 'role', 'score', 'streak', 'reliability_score', 'joined_at']

    def get_name(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.username


class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'invite_code', 'member_count', 'created_by_username', 'created_at']
        read_only_fields = ['invite_code', 'created_by', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()
