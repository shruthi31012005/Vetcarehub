from django.db import models
from django.conf import settings
from animals.models import Animal


class Vaccination(models.Model):

    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("completed", "Completed"),
        ("overdue", "Overdue"),
    ]

    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        related_name="vaccinations"
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owner_vaccinations"
    )

    vaccine_name = models.CharField(max_length=255)

    date_administered = models.DateField()
    next_due_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="upcoming"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.animal.name} - {self.vaccine_name}"