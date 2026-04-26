from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from .models import Team, TeamMember
from .serializers import TeamSerializer, TeamMemberSerializer


class TeamViewSet(ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(members__user=self.request.user) | Team.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        team = serializer.save(created_by=self.request.user)
        TeamMember.objects.create(team=team, user=self.request.user, role='ADMIN')

    @action(detail=False, methods=['post'], url_path='join')
    def join(self, request):
        code = request.data.get('invite_code', '').strip().upper()
        if TeamMember.objects.filter(user=request.user).exists():
            return Response({'error': 'You are already in a team'}, status=400)
        try:
            team = Team.objects.get(invite_code=code)
        except Team.DoesNotExist:
            return Response({'error': 'Invalid invite code'}, status=404)
        TeamMember.objects.create(team=team, user=request.user, role='MEMBER')
        return Response(TeamSerializer(team).data)

    @action(detail=False, methods=['get'], url_path='my')
    def my_team(self, request):
        try:
            membership = TeamMember.objects.select_related('team').get(user=request.user)
            return Response(TeamSerializer(membership.team).data)
        except TeamMember.DoesNotExist:
            return Response({'error': 'Not in a team'}, status=404)

    @action(detail=True, methods=['get'], url_path='members')
    def members(self, request, pk=None):
        team = self.get_object()
        members = TeamMember.objects.filter(team=team).select_related('user')
        return Response(TeamMemberSerializer(members, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def leaderboard(request):
    sort_by = request.query_params.get('sort', 'score')
    members = TeamMember.objects.select_related('user').all()
    if sort_by == 'reliability':
        members = members.order_by('-reliability_score')
    elif sort_by == 'streak':
        members = members.order_by('-streak')
    else:
        members = members.order_by('-score')

    from tasks.models import Task
    data = []
    for m in members:
        completed = Task.objects.filter(created_by=m.user, status='DONE').count()
        data.append({
            'userId': m.user.id,
            'name': m.user.get_full_name() or m.user.username,
            'score': m.score,
            'streak': m.streak,
            'reliabilityScore': m.reliability_score,
            'completedTasks': completed,
        })
    return Response(data)
