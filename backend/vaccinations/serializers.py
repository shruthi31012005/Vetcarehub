from rest_framework import serializers
from .models import Vaccination


class VaccinationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vaccination
        fields = [
            "id",
            "animal",
            "owner",
            "vaccine_name",
            "date_administered",
            "next_due_date",
            "status",
            "created_at",
        ]
        read_only_fields = ["owner", "created_at"]