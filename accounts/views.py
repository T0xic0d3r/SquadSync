from django.contrib.auth.models import User
from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    filterset_fields = ['is_staff', 'is_active']
    search_fields = ['username', 'email']
    ordering = ['id']

    # 🔐 READ RULES
    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return User.objects.all()

        return User.objects.filter(id=user.id)

    # 🔐 CREATE RULE
    def perform_create(self, serializer):
        user = self.request.user

        # Only admin can create users
        if not user.is_staff:
            raise permissions.PermissionDenied("Only admin can create users")

        serializer.save()

    # 🔐 UPDATE RULE
    def perform_update(self, serializer):
        user = self.request.user

        obj = self.get_object()

        # admin can update anyone
        if user.is_staff or obj.id == user.id:
            serializer.save()
        else:
            raise permissions.PermissionDenied("Not allowed to update this user")

    # 🔐 DELETE RULE
    def destroy(self, request, *args, **kwargs):
        user = request.user
        obj = self.get_object()

        if user.is_staff:
            return super().destroy(request, *args, **kwargs)

        raise permissions.PermissionDenied("Only admin can delete users")