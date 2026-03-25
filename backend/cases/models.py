
# Create your models here.
from django.db import models
from django.conf import settings
from animals.models import Animal


class Case(models.Model):
    vet_diagnosis = models.TextField(blank=True, null=True)
    treatment_plan = models.TextField(blank=True, null=True)
    prescription = models.TextField(blank=True, null=True)
    advice = models.TextField(blank=True, null=True)
    follow_up_date = models.DateField(blank=True, null=True)

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in progress", "In Progress"),
        ("completed", "Completed"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("emergency", "Emergency"),
    ]

    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vet_cases"
    )

    predicted_disease = models.CharField(max_length=255)
    confidence = models.FloatField()

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="medium"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"{self.animal.name} - {self.predicted_disease}"