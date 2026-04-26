from django.contrib.auth.models import User
from rest_framework import viewsets, filters, permissions
from rest_framework.generics import CreateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer, RegisterSerializer


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_staff', 'is_active']
    search_fields = ['username', 'email']
    ordering = ['id']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Only admin can create users")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        obj = self.get_object()
        if user.is_staff or obj.id == user.id:
            serializer.save()
        else:
            raise permissions.PermissionDenied("Not allowed to update this user")

    def destroy(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().destroy(request, *args, **kwargs)
        raise permissions.PermissionDenied("Only admin can delete users")
