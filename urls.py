from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'squadsync-backend'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health'),
    path('api/auth/', include('accounts.urls')),
    path('api/tasks/', include('tasks.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
