from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CandidateProfile, RecruiterProfile
from core.helpers import get_absolute_media_url

User = get_user_model()

class CandidateProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = ['full_name', 'avatar', 'avatar_url', 'skills', 'resume', 'resume_url', 'experience', 'education', 'github', 'linkedin']

    def get_avatar_url(self, obj):
        if obj.avatar:
            return get_absolute_media_url(obj.avatar.url, self.context.get('request'))
        return None

    def get_resume_url(self, obj):
        if obj.resume:
            return get_absolute_media_url(obj.resume.url, self.context.get('request'))
        return None


class RecruiterProfileSerializer(serializers.ModelSerializer):
    company_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = RecruiterProfile
        fields = ['company_name', 'company_logo', 'company_logo_url', 'company_description', 'website']

    def get_company_logo_url(self, obj):
        if obj.company_logo:
            return get_absolute_media_url(obj.company_logo.url, self.context.get('request'))
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile']

    def get_profile(self, obj):
        if obj.role == 'candidate':
            profile_obj, created = CandidateProfile.objects.get_or_create(user=obj)
            return CandidateProfileSerializer(profile_obj, context=self.context).data
        elif obj.role == 'recruiter':
            profile_obj, created = RecruiterProfile.objects.get_or_create(user=obj)
            return RecruiterProfileSerializer(profile_obj, context=self.context).data
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'company_name', 'full_name']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', 'candidate')
        company_name = validated_data.pop('company_name', '')
        full_name = validated_data.pop('full_name', '')

        # Create user
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Update profiles with specific fields provided during registration
        if role == 'candidate' and full_name:
            profile = user.candidate_profile
            profile.full_name = full_name
            profile.save()
        elif role == 'recruiter' and company_name:
            profile = user.recruiter_profile
            profile.company_name = company_name
            profile.save()

        return user
