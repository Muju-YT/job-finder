from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Prefix-grouped api endpoints
    path('api/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')), # Mounts at api/jobs/
    path('api/', include('applications.urls')), # Mounts at api/apply/ and api/applications/
    path('api/', include('notifications.urls')), # Mounts at api/notifications/
]

# Serves media files (avatar images, PDF resumes, logos) in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
