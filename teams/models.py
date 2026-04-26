import random
import string
from django.db import models
from django.contrib.auth.models import User


def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    invite_code = models.CharField(max_length=8, unique=True, default=generate_invite_code)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_teams')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    ROLE_CHOICES = [('ADMIN', 'Admin'), ('MEMBER', 'Member')]
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    score = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    reliability_score = models.FloatField(default=100.0)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('team', 'user')

    def __str__(self):
        return f"{self.user.username} in {self.team.name}"
