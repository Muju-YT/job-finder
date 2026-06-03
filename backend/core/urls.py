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

from django.views.static import serve
from django.urls import re_path

# Serve media files in both development and production
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]