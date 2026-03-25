from rest_framework import serializers
from .models import Case


class CaseSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source="animal.name", read_only=True)

    class Meta:
        model = Case
        fields = [
            "id",
            "animal_name",
            "predicted_disease",
            "confidence",
            "priority",
            "status",
            "created_at",
            "vet_diagnosis",
            "treatment_plan",
            "prescription",
            "advice",
            "follow_up_date"
        ]