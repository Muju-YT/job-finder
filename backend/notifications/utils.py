from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from .serializers import NotificationSerializer

def send_custom_notification(user, title, message, notification_type, related_id=None):
    """
    Creates a Notification database record and pushes a real-time WebSocket
    event to the user's personal channel group.
    """
    # 1. Create database record
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        related_id=related_id
    )

    # 2. Prepare payload
    serializer = NotificationSerializer(notification)
    payload = serializer.data

    # 3. Broadcast real-time message via Django Channels
    channel_layer = get_channel_layer()
    if channel_layer:
        group_name = f"user_{user.id}"
        try:
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    "type": "notification_received",
                    "data": payload
                }
            )
        except Exception as e:
            # Silently log/ignore channel layer failures to prevent critical API failures 
            # if Redis happens to be temporarily down in development/prod
            print(f"Failed to send real-time notification: {e}")
            
    return notification
