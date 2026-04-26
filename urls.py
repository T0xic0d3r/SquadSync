from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def home(request):
    return HttpResponse("Welcome to SquadSync API 🚀")

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'squadsync-backend'})

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('accounts.urls')),
    path('api/', include('tasks.urls')),
    path('api/', include('teams.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
