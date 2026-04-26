from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(members=self.request.user) | Team.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        team = serializer.save(created_by=self.request.user)
        team.members.add(self.request.user)

    @action(detail=False, methods=['post'], url_path='join')
    def join(self, request):
        code = request.data.get('invite_code', '').strip().upper()
        try:
            team = Team.objects.get(invite_code=code)
            team.members.add(request.user)
            return Response(TeamSerializer(team).data)
        except Team.DoesNotExist:
            return Response({'error': 'Invalid invite code'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='my')
    def my_team(self, request):
        teams = Team.objects.filter(members=request.user)
        if teams.exists():
            return Response(TeamSerializer(teams.first()).data)
        return Response({'error': 'Not in a team'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], url_path='members')
    def members(self, request, pk=None):
        team = self.get_object()
        from accounts.serializers import UserSerializer
        return Response(UserSerializer(team.members.all(), many=True).data)
