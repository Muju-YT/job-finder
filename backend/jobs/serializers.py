from rest_framework import serializers
from .models import Job
from users.serializers import UserSerializer

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()
    recruiter_username = serializers.CharField(source='recruiter.username', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'recruiter', 'recruiter_username', 'company_name', 'company_logo',
            'title', 'description', 'requirements', 'salary_min', 'salary_max',
            'location_type', 'location', 'job_type', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['recruiter', 'created_at', 'updated_at']

    def get_company_name(self, obj):
        if hasattr(obj.recruiter, 'recruiter_profile'):
            return obj.recruiter.recruiter_profile.company_name or obj.recruiter.username
        return obj.recruiter.username

    def get_company_logo(self, obj):
        if hasattr(obj.recruiter, 'recruiter_profile') and obj.recruiter.recruiter_profile.company_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.recruiter.recruiter_profile.company_logo.url)
            return obj.recruiter.recruiter_profile.company_logo.url
        return None
