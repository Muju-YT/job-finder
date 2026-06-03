from django.urls import path
from .views import NotificationListView, MarkNotificationsReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/mark-read/', MarkNotificationsReadView.as_view(), name='notification-mark-read'),
]
