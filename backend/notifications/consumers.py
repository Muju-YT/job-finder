import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')
        self.groups_joined = []

        # All users (even anonymous visitors browsing jobs) join the 'jobs' channel for live postings
        await self.channel_layer.group_add("jobs", self.channel_name)
        self.groups_joined.append("jobs")

        # Authenticated users also join their private notification group
        if self.user and self.user.is_authenticated:
            self.user_group = f"user_{self.user.id}"
            await self.channel_layer.group_add(self.user_group, self.channel_name)
            self.groups_joined.append(self.user_group)

        await self.accept()

    async def disconnect(self, close_code):
        for group in self.groups_joined:
            await self.channel_layer.group_discard(group, self.channel_name)

    # Handler for live jobs (broadcast to everyone)
    async def job_created(self, event):
        await self.send_json({
            "type": "job_created",
            "data": event["data"]
        })

    # Handler for private notifications (directed to individual user)
    async def notification_received(self, event):
        await self.send_json({
            "type": "notification_received",
            "data": event["data"]
        })
