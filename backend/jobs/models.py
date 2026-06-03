from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Job(models.Model):
    LOCATION_TYPE_CHOICES = (
        ('remote', 'Remote'),
        ('onsite', 'On-site'),
        ('hybrid', 'Hybrid'),
    )
    
    JOB_TYPE_CHOICES = (
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('internship', 'Internship'),
        ('contract', 'Contract'),
    )

    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(help_text="Comma-separated or bullet list of requirements")
    salary_min = models.DecimalField(max_digits=12, decimal_places=2)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2)
    location_type = models.CharField(max_length=20, choices=LOCATION_TYPE_CHOICES, default='onsite')
    location = models.CharField(max_length=255, help_text="City, State or Country")
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full_time')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.recruiter.recruiter_profile.company_name or self.recruiter.username}"
