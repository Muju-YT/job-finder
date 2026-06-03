from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer

class IsRecruiter(permissions.BasePermission):
    """
    Allows access only to recruiters.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'recruiter'


class IsJobOwner(permissions.BasePermission):
    """
    Allows access only if the recruiter created the job.
    """
    def has_object_permission(self, request, view, obj):
        return obj.recruiter == request.user


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title', 'description', 'requirements']
    
    # Custom filter logic
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        # Recruiter searching their own listings (includes inactive ones too)
        my_postings = self.request.query_params.get('my_postings', None)
        if my_postings == 'true' and self.request.user.is_authenticated and self.request.user.role == 'recruiter':
            queryset = Job.objects.filter(recruiter=self.request.user)
            return queryset
            
        # Standard browse filters
        location_type = self.request.query_params.get('location_type', None)
        if location_type:
            queryset = queryset.filter(location_type=location_type)
            
        job_type = self.request.query_params.get('job_type', None)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
            
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        min_salary = self.request.query_params.get('min_salary', None)
        if min_salary:
            queryset = queryset.filter(salary_max__gte=min_salary)
            
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsRecruiter]
        else: # update, partial_update, destroy
            permission_classes = [permissions.IsAuthenticated, IsRecruiter, IsJobOwner]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def my_postings(self, request):
        jobs = Job.objects.filter(recruiter=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
