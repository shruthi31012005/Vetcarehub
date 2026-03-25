from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer
from animals.models import Animal
from notifications.models import Notification


# -------------------------------------------------
# OWNER: Book Appointment
# -------------------------------------------------
class BookAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "owner":
            return Response({"error": "Only owners can book appointments"}, status=403)

        animal_id = request.data.get("animal_id")

        try:
            animal = Animal.objects.get(id=animal_id, owner=request.user)
        except Animal.DoesNotExist:
            return Response({"error": "Animal not found"}, status=404)

        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=request.user, animal=animal)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    
# -------------------------------------------------
# OWNER: View My Appointments
# -------------------------------------------------
class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role == "owner":
            appointments = Appointment.objects.filter(owner=request.user)

        elif request.user.role == "vet":
            appointments = Appointment.objects.all().order_by("-appointment_date")

        elif request.user.role == "admin":
            appointments = Appointment.objects.all()

        else:
            return Response({"error": "Invalid role"}, status=403)

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

# -------------------------------------------------
# VET: View Pending Appointments
# -------------------------------------------------
class VetPendingAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        appointments = Appointment.objects.filter(status="pending")

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


# -------------------------------------------------
# VET: Confirm Appointment
# -------------------------------------------------
class ConfirmAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

        appointment.status = "confirmed"
        appointment.vet = request.user
        appointment.save()

        # --- Create a Case for this appointment ---
        from cases.models import Case
        from predictions.models import Prediction

        # Try to get the latest prediction for this animal
        prediction = Prediction.objects.filter(animal=appointment.animal).order_by('-created_at').first()
        predicted_disease = prediction.ai_predicted_name if prediction else "Unknown"
        confidence = prediction.confidence_score if prediction else 0.0
        # Priority logic: emergency if prediction.emergency_flag, else medium
        priority = "emergency" if prediction and getattr(prediction, 'emergency_flag', False) else "medium"

        Case.objects.create(
            animal=appointment.animal,
            owner=appointment.owner,
            vet=appointment.vet,
            predicted_disease=predicted_disease,
            confidence=confidence,
            priority=priority,
            status="pending"
        )

        from notifications.models import Notification
        Notification.objects.create(
            user=appointment.owner,
            type="appointment",
            message=f"Your appointment for {appointment.animal.name} on {appointment.appointment_date} has been confirmed."
        )

        return Response({"message": "Appointment confirmed and case created"})


# -------------------------------------------------
# Complete Appointment
# -------------------------------------------------
class CompleteAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

        appointment.status = "completed"
        appointment.save()

        return Response({"message": "Appointment completed"})
    
# -------------------------------------------------
# OWNER: Cancel Appointment
# -------------------------------------------------
class CancelAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        if request.user.role != "owner":
            return Response({"error": "Only owners allowed"}, status=403)

        try:
            appointment = Appointment.objects.get(
                id=appointment_id,
                owner=request.user
            )
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

        appointment.status = "cancelled"
        appointment.save()

        return Response({"message": "Appointment cancelled"})
    
# -------------------------------------------------
# VET: Reject Appointment
# -------------------------------------------------
class RejectAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

        appointment.status = "rejected"
        appointment.vet = request.user
        appointment.save()

        Notification.objects.create(
            user=appointment.owner,
            type="appointment",
            message=f"Your appointment for {appointment.animal.name} has been rejected."
        )

        return Response({"message": "Appointment rejected"})