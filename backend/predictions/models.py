from django.db import models
from django.conf import settings
from animals.models import Animal
from diseases.models import Disease


# ----------------------------
# AI Prediction Model
# ----------------------------
class Prediction(models.Model):

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    quick_species = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    predicted_disease = models.ForeignKey(
        Disease,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    ai_predicted_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    # 🔥 NEW FIELDS
    severity = models.CharField(max_length=50, null=True, blank=True)
    disease_description = models.TextField(null=True, blank=True)
    symptoms_analysis = models.TextField(null=True, blank=True)
    recommended_treatment = models.TextField(null=True, blank=True)
    suggested_medication = models.TextField(null=True, blank=True)
    prevention_tips = models.TextField(null=True, blank=True)
    additional_notes = models.TextField(null=True, blank=True)
    home_care = models.TextField(null=True, blank=True)
    emergency_flag = models.BooleanField(default=False)

    confidence_score = models.FloatField()
    symptoms_input = models.TextField()

    image = models.ImageField(
        upload_to='prediction_images/',
        null=True,
        blank=True
    )

    reviewed_by_vet = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.animal:
            animal_name = self.animal.name
        else:
            animal_name = f"Quick Prediction ({self.quick_species})"

        disease_name = self.ai_predicted_name or "Unknown"

        return f"{animal_name} - {disease_name}"

# ----------------------------
# Vet Case Review Model
# ----------------------------
class CaseReview(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("closed", "Closed"),
    ]

    prediction = models.ForeignKey(
        Prediction,
        on_delete=models.CASCADE,
        related_name="case_reviews"
    )

    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vet_case_reviews"
    )

    vet_diagnosis = models.TextField(null=True, blank=True)
    treatment_plan = models.TextField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CaseReview #{self.id} - {self.status}"