from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Animal
from .serializers import AnimalSerializer

from predictions.models import Prediction
from vaccinations.models import Vaccination


# ========================================
# OWNER PERMISSION
# ========================================

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


# ========================================
# LIST + CREATE ANIMALS
# ========================================

class AnimalListCreateView(generics.ListCreateAPIView):

    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Animal.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ========================================
# RETRIEVE / UPDATE / DELETE ANIMAL
# ========================================

class AnimalDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    queryset = Animal.objects.all()


# ========================================
# ANIMAL DASHBOARD
# ========================================

@api_view(["GET"])
def animal_dashboard(request, animal_id):

    try:
        animal = Animal.objects.get(id=animal_id,owner=request.user)
    except Animal.DoesNotExist:
        return Response({"error": "Animal not found"}, status=404)

    predictions = Prediction.objects.filter(animal=animal).order_by("-created_at")
    vaccinations = Vaccination.objects.filter(animal=animal)
    latest_prediction = predictions.first()
    risk_level = "Unknown"
    if latest_prediction:
        risk_level = latest_prediction.severity if hasattr(latest_prediction, "severity") else "Unknown"

    data = {

        "animal": {
            "id": animal.id,
            "name": animal.name,
            "species": animal.species,
            "breed": animal.breed,
            "gender": animal.gender,
            "age_years": animal.age_years,
            "age_months": animal.age_months,
            "weight": animal.weight,
            "location": animal.location,
            "status": animal.status,
            "image": animal.image.url if animal.image else None
        },
        
        "risk_level":risk_level,
        "records": [
            {
                "id": p.id,
                "disease": (
                    getattr(p, "ai_predicted_name", None)
                    or (p.predicted_disease.name if getattr(p, "predicted_disease", None) else None)
                    or getattr(p, "prediction", None)
                    or getattr(p, "disease", None)
                    or getattr(p, "result", "Unknown")
                ),
                "summary": getattr(p, "summary", None),
                "confidence": getattr(p, "confidence_score", None),
                "date": p.created_at
            }
            for p in predictions
        ],

        "vaccinations": [
            {
                "name": v.vaccine_name,
                "status": v.status,
                "next_due": v.next_due_date
            }
            for v in vaccinations
        ]
    }

    return Response(data)



