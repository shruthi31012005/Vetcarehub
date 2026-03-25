from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('vet', 'Veterinarian'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True)
    preferred_language = models.CharField(
    max_length=10,
    choices=[
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('te', 'Telugu')
    ],
    default='en'
)
    def __str__(self):
        return f"{self.username} - {self.role}"