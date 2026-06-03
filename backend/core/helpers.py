import os
from django.conf import settings

def get_absolute_media_url(file_url, request=None):
    """
    Builds an absolute URL for a media file.
    Uses the request context if available, otherwise falls back to BACKEND_URL from settings.
    """
    if not file_url:
        return None
    if file_url.startswith(('http://', 'https://')):
        return file_url
    if request:
        return request.build_absolute_uri(file_url)
    
    backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
    return f"{backend_url.rstrip('/')}{file_url}"
