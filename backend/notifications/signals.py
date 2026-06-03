from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from jobs.models import Job
from applications.models import Application
from .utils import send_custom_notification

@receiver(post_save, sender=Job)
def broadcast_new_job(sender, instance, created, **kwargs):
    """
    On job creation, broadcasts the job data to the 'jobs' websocket group.
    Ensures active browsers receive new listings instantly without reload.
    """
    if created and instance.is_active:
        channel_layer = get_channel_layer()
        if channel_layer:
            # We import here to avoid circular imports
            from jobs.serializers import JobSerializer
            serializer = JobSerializer(instance)
            try:
                async_to_sync(channel_layer.group_send)(
                    "jobs",
                    {
                        "type": "job_created",
                        "data": serializer.data
                    }
                )
            except Exception as e:
                print(f"Failed to broadcast live job creation: {e}")


@receiver(post_save, sender=Application)
def handle_application_notifications(sender, instance, created, **kwargs):
    """
    1. If application is new -> notify the recruiter.
    2. If application status changes -> notify the candidate.
    """
    if created:
        # Notify recruiter
        recruiter = instance.job.recruiter
        candidate_name = instance.candidate.candidate_profile.full_name or instance.candidate.username
        job_title = instance.job.title
        send_custom_notification(
            user=recruiter,
            title="New Application",
            message=f"{candidate_name} has applied for your job '{job_title}'.",
            notification_type="application_received",
            related_id=instance.id
        )
    else:
        # Notify candidate about the status update
        candidate = instance.candidate
        job_title = instance.job.title
        status_label = instance.get_status_display()
        send_custom_notification(
            user=candidate,
            title="Application Update",
            message=f"Your application status for '{job_title}' is now: {status_label}.",
            notification_type="status_change",
            related_id=instance.id
        )
ModelName = "Job"
