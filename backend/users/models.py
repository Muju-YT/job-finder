from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')
    
    # Use email or username for auth, make email required
    REQUIRED_FIELDS = ['email']
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    full_name = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills")
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.full_name or self.user.username


class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=255, blank=True)
    company_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    company_description = models.TextField(blank=True)
    website = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.company_name or self.user.username


# Signals to automatically create profiles on User creation
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'candidate':
            CandidateProfile.objects.create(user=instance)
        elif instance.role == 'recruiter':
            RecruiterProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if instance.role == 'candidate':
        if hasattr(instance, 'candidate_profile'):
            instance.candidate_profile.save()
        else:
            CandidateProfile.objects.create(user=instance)
    elif instance.role == 'recruiter':
        if hasattr(instance, 'recruiter_profile'):
            instance.recruiter_profile.save()
        else:
            RecruiterProfile.objects.create(user=instance)
