from django.db import models
from django.conf import settings


class Animal(models.Model):

    SPECIES_CHOICES = (
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('cow', 'Cow'),
        ('goat', 'Goat'),
        ('poultry', 'Poultry'),
        ('aquatic', 'Aquatic'),
        ('wild', 'Wild'),
        ('bird', 'Bird'),
        ('insect', 'Insect'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('healthy', 'Healthy'),
        ('sick', 'Sick'),
        ('critical', 'Critical'),
    )

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='animals'
    )

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES)
    breed = models.CharField(max_length=100, blank=True, null=True)

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)

    age_years = models.IntegerField(default=0)
    age_months = models.IntegerField(default=0)

    weight = models.FloatField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='healthy')

    notes = models.TextField(blank=True, null=True)

    image = models.ImageField(upload_to='animals/', blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.species})"