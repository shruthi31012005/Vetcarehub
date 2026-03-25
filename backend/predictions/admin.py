from django.contrib import admin
from .models import Prediction, CaseReview


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "display_animal",
        "owner",
        "ai_predicted_name",
        "confidence_score",
        "reviewed_by_vet",
        "created_at"
    )

    list_filter = ("reviewed_by_vet", "created_at")
    search_fields = ("owner__username",)

    def display_animal(self, obj):
        if obj.animal:
            return obj.animal.name
        return f"Quick Prediction ({obj.quick_species})"

    display_animal.short_description = "Animal"


@admin.register(CaseReview)
class CaseReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "prediction",
        "status",
        "vet",
        "created_at",
    )
    list_filter = (
        "status",
        "created_at",
    )
    search_fields = (
        "prediction__animal__name",
    )