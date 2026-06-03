from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/', include('applications.urls')),
    path('api/', include('notifications.urls')),
]

# ✅ IMPORTANT: serve media in production too (temporary fix)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)