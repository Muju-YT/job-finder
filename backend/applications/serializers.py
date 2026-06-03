from rest_framework import serializers
from .models import Application
from jobs.models import Job
from django.contrib.auth import get_user_model
from core.helpers import get_absolute_media_url

User = get_user_model()

class CandidateMinimalSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='candidate_profile.full_name', read_only=True)
    skills = serializers.CharField(source='candidate_profile.skills', read_only=True)
    experience = serializers.CharField(source='candidate_profile.experience', read_only=True)
    education = serializers.CharField(source='candidate_profile.education', read_only=True)
    github = serializers.URLField(source='candidate_profile.github', read_only=True)
    linkedin = serializers.URLField(source='candidate_profile.linkedin', read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'skills', 'experience', 'education', 'github', 'linkedin', 'avatar']

    def get_avatar(self, obj):
        if hasattr(obj, 'candidate_profile') and obj.candidate_profile.avatar:
            return get_absolute_media_url(
                obj.candidate_profile.avatar.url,
                self.context.get('request')
            )
        return None


class JobMinimalSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'title', 'company_name', 'company_logo', 'location', 'location_type', 'job_type']

    def get_company_name(self, obj):
        if hasattr(obj.recruiter, 'recruiter_profile'):
            return obj.recruiter.recruiter_profile.company_name or obj.recruiter.username
        return obj.recruiter.username

    def get_company_logo(self, obj):
        if hasattr(obj.recruiter, 'recruiter_profile') and obj.recruiter.recruiter_profile.company_logo:
            return get_absolute_media_url(
                obj.recruiter.recruiter_profile.company_logo.url,
                self.context.get('request')
            )
        return None


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_details = CandidateMinimalSerializer(source='candidate', read_only=True)
    job_details = JobMinimalSerializer(source='job', read_only=True)
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_details', 'candidate', 'candidate_details',
            'resume', 'resume_url', 'cover_letter', 'status', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['candidate', 'applied_at', 'updated_at']

    def get_resume_url(self, obj):
        if obj.resume:
            return get_absolute_media_url(obj.resume.url, self.context.get('request'))
        # Fall back to candidate profile resume if not uploaded directly
        if hasattr(obj.candidate, 'candidate_profile') and obj.candidate.candidate_profile.resume:
            return get_absolute_media_url(
                obj.candidate.candidate_profile.resume.url,
                self.context.get('request')
            )
        return None
