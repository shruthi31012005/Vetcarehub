from rest_framework import serializers
from .models import Appointment



from animals.serializers import AnimalSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    animal_details = AnimalSerializer(source="animal", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["owner", "status", "created_at","animal"]
        # Add animal_details to the serialized output
        extra_fields = ['animal_details']