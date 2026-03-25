from django.db import models
from django.conf import settings


class ChatMessage(models.Model):

    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("vet", "Vet"),
        ("admin", "Admin"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_messages"
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    message = models.TextField()
    response = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"