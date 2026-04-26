from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, TaskProof, TaskComment
from .serializers import TaskSerializer, TaskProofSerializer, TaskCommentSerializer


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        return (Task.objects.filter(created_by=user) | Task.objects.filter(assigned_to=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        task = self.get_object()
        if request.method == 'GET':
            comments = TaskComment.objects.filter(task=task).order_by('created_at')
            return Response(TaskCommentSerializer(comments, many=True).data)
        serializer = TaskCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(task=task, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='proof')
    def proof(self, request, pk=None):
        task = self.get_object()
        proof_type = request.data.get('type', 'image')
        caption = request.data.get('caption', '')
        link = request.data.get('link', '')
        file_obj = request.FILES.get('file')

        TaskProof.objects.filter(task=task).delete()

        proof = TaskProof(task=task, type=proof_type, caption=caption)
        if proof_type == 'link':
            proof.url = link
        elif file_obj:
            proof.file = file_obj

        proof.save()
        task.status = 'SUBMITTED'
        task.save()
        return Response(TaskProofSerializer(proof).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        task = self.get_object()
        approved = request.data.get('approved', False)
        reason = request.data.get('reason', '')

        if task.created_by != request.user:
            return Response({'error': 'Only the task creator can approve/reject'}, status=403)

        if task.status != 'SUBMITTED':
            return Response({'error': 'Task is not in SUBMITTED state'}, status=400)

        if approved:
            task.status = 'APPROVED'
            task.score = 10
            try:
                from teams.models import TeamMember
                membership = TeamMember.objects.get(user=task.assigned_to)
                membership.score += 10
                membership.save()
            except Exception:
                pass
        else:
            task.status = 'REJECTED'
            if hasattr(task, 'proof'):
                task.proof.status = 'REJECTED'
                task.proof.rejection_reason = reason
                task.proof.save()

        task.save()
        return Response(TaskSerializer(task).data)
