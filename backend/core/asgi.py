import os
import django

# Setup django environment before importing anything else that needs it
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    os.getenv('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
)
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from notifications.middleware import JWTAuthMiddleware
import core.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            core.routing.websocket_urlpatterns
        )
    ),
})
