from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Vaccination
from .serializers import VaccinationSerializer
from animals.models import Animal
from notifications.models import Notification


# -------------------------------------------------
# Add Vaccination Record
# -------------------------------------------------
class AddVaccinationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        animal_id = request.data.get("animal_id")

        try:
            animal = Animal.objects.get(id=animal_id, owner=request.user)
        except Animal.DoesNotExist:
            return Response({"error": "Animal not found"}, status=404)

        serializer = VaccinationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=request.user, animal=animal)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


# -------------------------------------------------
# Owner: View All Vaccinations
# -------------------------------------------------
class OwnerVaccinationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        vaccinations = Vaccination.objects.filter(
            owner=request.user
        ).order_by("next_due_date")

        serializer = VaccinationSerializer(vaccinations, many=True)
        return Response(serializer.data)


# -------------------------------------------------
# Upcoming Vaccinations
# -------------------------------------------------
class UpcomingVaccinationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        today = timezone.now().date()

        vaccinations = Vaccination.objects.filter(
            owner=request.user,
            next_due_date__gte=today
        ).order_by("next_due_date")

        serializer = VaccinationSerializer(vaccinations, many=True)
        return Response(serializer.data)


# -------------------------------------------------
# Overdue Vaccinations
# -------------------------------------------------
class OverdueVaccinationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        today = timezone.now().date()

        vaccinations = Vaccination.objects.filter(
            owner=request.user,
            next_due_date__lt=today,
            status="upcoming"
        )

        # Auto-mark as overdue
        #for v in vaccinations:
         #   v.status = "overdue"
          #  v.save()
        from notifications.models import Notification

        for v in vaccinations:
            if v.status != "overdue":  # prevent duplicate notifications
                v.status = "overdue"
                v.save()

                Notification.objects.create(
                    user=v.owner,
                    type="vaccination",
                    message=f"Vaccination '{v.vaccine_name}' for {v.animal.name} is overdue."
                )

        serializer = VaccinationSerializer(vaccinations, many=True)
        return Response(serializer.data)
    
# -------------------------------------------------
# Vaccination List & Create View
# -------------------------------------------------
from rest_framework import generics
from .models import Vaccination
from .serializers import VaccinationSerializer
from rest_framework.permissions import IsAuthenticated

class VaccinationListCreateView(generics.ListCreateAPIView):
    serializer_class = VaccinationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vaccination.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
# -------------------------------------------------
# Vaccination Detail View
# -------------------------------------------------
from rest_framework import generics
from .models import Vaccination
from .serializers import VaccinationSerializer

class VaccinationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VaccinationSerializer

    def get_queryset(self):
        return Vaccination.objects.filter(owner=self.request.user)
    
# -------------------------------------------------
# VET: View All Vaccination Requests
# -------------------------------------------------
class VetVaccinationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        vaccinations = Vaccination.objects.filter(status="upcoming").order_by("next_due_date")

        serializer = VaccinationSerializer(vaccinations, many=True)
        return Response(serializer.data)
    
# -------------------------------------------------
# VET: Mark Vaccination Completed
# -------------------------------------------------
class CompleteVaccinationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, vaccination_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            vaccination = Vaccination.objects.get(id=vaccination_id)
        except Vaccination.DoesNotExist:
            return Response({"error": "Vaccination not found"}, status=404)

        vaccination.status = "completed"
        vaccination.save()

        Notification.objects.create(
            user=vaccination.owner,
            type="vaccination",
            message=f"Vaccination '{vaccination.vaccine_name}' for {vaccination.animal.name} has been completed."
        )

        return Response({"message": "Vaccination marked as completed"})