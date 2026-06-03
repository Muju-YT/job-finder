from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer, CandidateProfileSerializer, RecruiterProfileSerializer
from .models import CandidateProfile, RecruiterProfile

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class UserMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'candidate':
            profile, created = CandidateProfile.objects.get_or_create(user=user)
            serializer = CandidateProfileSerializer(profile, context={'request': request})
        else:
            profile, created = RecruiterProfile.objects.get_or_create(user=user)
            serializer = RecruiterProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if user.role == 'candidate':
            profile, created = CandidateProfile.objects.get_or_create(user=user)
            serializer = CandidateProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        else:
            profile, created = RecruiterProfile.objects.get_or_create(user=user)
            serializer = RecruiterProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            # Also update name / company name on the register front if provided
            full_name = request.data.get('full_name')
            company_name = request.data.get('company_name')
            if user.role == 'candidate' and full_name:
                profile.full_name = full_name
                profile.save()
            elif user.role == 'recruiter' and company_name:
                profile.company_name = company_name
                profile.save()
                
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
