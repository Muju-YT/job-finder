from django.urls import path
from .views import ApplicationViewSet

urlpatterns = [
    path('apply/', ApplicationViewSet.as_view({'post': 'create'}), name='apply'),
    path('applications/', ApplicationViewSet.as_view({'get': 'list'}), name='application-list'),
    path('applications/<int:pk>/', ApplicationViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update'
    }), name='application-detail'),
]
