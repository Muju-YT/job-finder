from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'candidate'


class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'recruiter'


class IsApplicationParty(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow candidate who applied or recruiter who posted the job
        return obj.candidate == request.user or obj.job.recruiter == request.user


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()
            
        if user.role == 'candidate':
            return Application.objects.filter(candidate=user)
        elif user.role == 'recruiter':
            # Get applications for jobs posted by this recruiter
            return Application.objects.filter(job__recruiter=user)
        return Application.objects.none()

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsCandidate]
        elif self.action in ['partial_update', 'update']:
            permission_classes = [permissions.IsAuthenticated, IsRecruiter, IsApplicationParty]
        else: # list, retrieve, destroy
            permission_classes = [permissions.IsAuthenticated, IsApplicationParty]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        # Custom creation endpoint to allow file uploads (resume)
        job_id = request.data.get('job')
        if not job_id:
            return Response({"error": "Job ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            job = Job.objects.get(id=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response({"error": "Active Job not found."}, status=status.HTTP_404_NOT_FOUND)
            
        # Check if already applied
        if Application.objects.filter(job=job, candidate=request.user).exists():
            return Response({"error": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(candidate=request.user, status='pending')
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
