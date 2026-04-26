from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, leaderboard

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard', leaderboard, name='leaderboard'),
]
