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
        user = self.request.user
        memberships = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
        return Team.objects.filter(id__in=memberships) | Team.objects.filter(created_by=user)

    def perform_create(self, serializer):
        # Prevent user from being in two teams
        if TeamMember.objects.filter(user=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError('You are already in a team. Leave it before creating a new one.')
        team = serializer.save(created_by=self.request.user)
        TeamMember.objects.create(team=team, user=self.request.user, role='ADMIN')

    @action(detail=False, methods=['post'], url_path='join')
    def join(self, request):
        code = request.data.get('invite_code', '').strip().upper()
        if not code:
            return Response({'error': 'invite_code is required'}, status=400)
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

    @action(detail=False, methods=['post'], url_path='leave')
    def leave(self, request):
        try:
            membership = TeamMember.objects.get(user=request.user)
            membership.delete()
            return Response({'message': 'Left team successfully'})
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

    try:
        membership = TeamMember.objects.get(user=request.user)
        team = membership.team
    except TeamMember.DoesNotExist:
        return Response({'error': 'Not in a team'}, status=404)

    members = TeamMember.objects.filter(team=team).select_related('user')

    if sort_by == 'reliability':
        members = members.order_by('-reliability_score')
    elif sort_by == 'streak':
        members = members.order_by('-streak')
    else:
        members = members.order_by('-score')

    from tasks.models import Task
    data = []
    for m in members:
        completed = Task.objects.filter(assigned_to=m.user, status='APPROVED').count()
        data.append({
            'userId': m.user.id,
            'name': m.user.get_full_name() or m.user.username,
            'score': m.score,
            'streak': m.streak,
            'reliabilityScore': m.reliability_score,
            'completedTasks': completed,
        })
    return Response(data)
