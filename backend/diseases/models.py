from django.db import models


class Disease(models.Model):

    SEVERITY_CHOICES = (
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField()
    symptoms = models.TextField(help_text="Comma separated symptoms")
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    contagious = models.BooleanField(default=False)
    affected_species = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name