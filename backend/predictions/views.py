from collections import defaultdict
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from animals.models import Animal
from users.models import User
from notifications.models import Notification
from .models import Prediction, CaseReview
from .serializers import CaseReviewSerializer
from .ai_services.router import handle_prediction
from .ai_services.offline_ai import run_offline_ai
from .ai_services.feature_builder import build_features
from .ai_services.risk_predictor import predict_risk
import pandas as pd
import os


# =================================================
# REGISTERED ANIMAL PREDICTION
# =================================================
class PredictDiseaseView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):

        animal_id = request.data.get("animal_id")
        symptoms = request.data.get("symptoms")
        image = request.FILES.get("image")

        if not animal_id:
            return Response({"error": "Animal ID required"}, status=400)

        if not symptoms:
            return Response({"error": "Symptoms required"}, status=400)

        try:
            animal = Animal.objects.get(id=animal_id, owner=request.user)
        except Animal.DoesNotExist:
            return Response({"error": "Animal not found"}, status=404)

        result = handle_prediction(animal, symptoms, image=image)

        Prediction.objects.create(
            owner=request.user,
            animal=animal,
            ai_predicted_name=result.get("predicted_disease"),
            severity=result.get("severity"),
            confidence_score=result.get("confidence", 0),
            disease_description=result.get("description"),
            symptoms_analysis=result.get("symptoms_analysis"),
            recommended_treatment=result.get("recommended_treatment"),
            suggested_medication=result.get("suggested_medication"),
            prevention_tips=result.get("prevention_tips"),
            additional_notes=result.get("additional_notes"),
            emergency_flag=result.get("emergency", False),
            symptoms_input=symptoms,
            image=image
        )

        return Response(result)
    
# =================================================
# DISEASE PREDICTION VIEW
# =================================================
class DiseasePredictionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        animal_id = request.data.get("animal_id")
        symptoms = request.data.get("symptoms", [])

        try:
            animal = Animal.objects.get(id=animal_id)
        except Animal.DoesNotExist:
            return Response({"error": "Animal not found"}, status=404)

        # Convert symptoms → ML features
        features = build_features(animal, symptoms)

        # Run AI prediction
        ai_result = run_offline_ai(animal, features)

        disease = ai_result["disease"]
        confidence = ai_result["confidence"]
        risk = ai_result["risk_level"]
        explanation = ai_result["explanation"]

        # Save prediction
        prediction = Prediction.objects.create(
            animal=animal,
            owner=request.user,
            predicted_disease=disease,
            confidence=confidence,
            risk_level=risk,
            explanation=explanation
        )

        return Response({
            "prediction_id": prediction.id,
            "disease": disease,
            "confidence": confidence,
            "risk_level": risk,
            "explanation": explanation
        })

# =================================================
# QUICK PREDICTION
# =================================================
class QuickPredictionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):

        species = request.data.get("species")
        symptoms = request.data.get("symptoms")
        image = request.FILES.get("image")

        if not species:
            return Response({"error": "Species required"}, status=400)

        if not symptoms:
            return Response({"error": "Symptoms required"}, status=400)

        class TempAnimal:
            def __init__(self, species):
                self.species = species

        result = handle_prediction(TempAnimal(species), symptoms, image=image)

        Prediction.objects.create(
            owner=request.user,
            animal=None,
            quick_species=species,
            ai_predicted_name=result.get("predicted_disease"),
            severity=result.get("severity"),
            confidence_score=result.get("confidence", 0),
            disease_description=result.get("description"),
            symptoms_analysis=result.get("symptoms_analysis"),
            recommended_treatment=result.get("recommended_treatment"),
            suggested_medication=result.get("suggested_medication"),
            prevention_tips=result.get("prevention_tips"),
            additional_notes=result.get("additional_notes"),
            emergency_flag=result.get("emergency", False),
            symptoms_input=symptoms,
            image=image
        )

        return Response(result)


# =================================================
# SUBMIT CASE FOR VET REVIEW
# =================================================
class SubmitCaseForReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, prediction_id):

        try:
            prediction = Prediction.objects.get(
                id=prediction_id,
                owner=request.user
            )
        except Prediction.DoesNotExist:
            return Response({"error": "Prediction not found"}, status=404)

        case = CaseReview.objects.create(prediction=prediction)

        return Response({
            "message": "Case submitted for vet review",
            "case_id": case.id
        })


# =================================================
# VET: VIEW PENDING CASES
# =================================================
class VetPendingCasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        cases = CaseReview.objects.filter(status="pending")
        serializer = CaseReviewSerializer(cases, many=True)

        return Response(serializer.data)


# =================================================
# VET REVIEW CASE
# =================================================
class VetReviewCaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, case_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            case = CaseReview.objects.get(id=case_id)
        except CaseReview.DoesNotExist:
            return Response({"error": "Case not found"}, status=404)

        case.vet = request.user
        case.vet_diagnosis = request.data.get("vet_diagnosis")
        case.treatment_plan = request.data.get("treatment_plan")
        case.status = "reviewed"
        case.reviewed_at = timezone.now()
        case.save()

        case.prediction.reviewed_by_vet = True
        case.prediction.save()

        Notification.objects.create(
            user=case.prediction.owner,
            type="case",
            message="Your case has been reviewed by a vet."
        )

        return Response({"message": "Case reviewed successfully"})


# =================================================
# CLOSE CASE
# =================================================
class VetCloseCaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, case_id):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        try:
            case = CaseReview.objects.get(id=case_id)
        except CaseReview.DoesNotExist:
            return Response({"error": "Case not found"}, status=404)

        if case.status != "reviewed":
            return Response(
                {"error": "Only reviewed cases can be closed"},
                status=400
            )

        case.status = "closed"
        case.save()

        return Response({"message": "Case closed successfully"})


# =================================================
# OWNER CASE HISTORY
# =================================================
class OwnerCaseStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "owner":
            return Response({"error": "Only owners allowed"}, status=403)

        cases = CaseReview.objects.filter(
            prediction__owner=request.user
        ).order_by("-created_at")

        serializer = CaseReviewSerializer(cases, many=True)

        return Response(serializer.data)


# =================================================
# VET REVIEWED HISTORY
# =================================================
class VetReviewedCasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        cases = CaseReview.objects.filter(
            status__in=["reviewed", "closed"]
        ).order_by("-reviewed_at")

        serializer = CaseReviewSerializer(cases, many=True)

        return Response(serializer.data)


# =================================================
# AI VS VET ACCURACY ANALYTICS
# =================================================
class AIVetAccuracyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role not in ["admin", "vet"]:
            return Response({"error": "Access denied"}, status=403)

        reviewed_cases = CaseReview.objects.filter(
            status__in=["reviewed", "closed"]
        )

        total = reviewed_cases.count()

        if total == 0:
            return Response({
                "total_reviewed_cases": 0,
                "ai_correct_predictions": 0,
                "ai_incorrect_predictions": 0,
                "accuracy_percentage": 0,
                "average_confidence": 0
            })

        correct = 0
        total_confidence = 0

        for case in reviewed_cases:
            prediction = case.prediction
            ai_name = (prediction.ai_predicted_name or "").lower()
            vet_diag = (case.vet_diagnosis or "").lower()

            total_confidence += prediction.confidence_score or 0

            if ai_name and ai_name in vet_diag:
                correct += 1

        accuracy = round((correct / total) * 100, 2)

        return Response({
            "total_reviewed_cases": total,
            "ai_correct_predictions": correct,
            "ai_incorrect_predictions": total - correct,
            "accuracy_percentage": accuracy,
            "average_confidence": round(total_confidence / total, 2)
        })


# =================================================
# DASHBOARDS
# =================================================
class OwnerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "owner":
            return Response({"error": "Only owners allowed"}, status=403)

        return Response({
            "total_predictions": Prediction.objects.filter(owner=request.user).count(),
            "total_cases": CaseReview.objects.filter(prediction__owner=request.user).count()
        })


class VetDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)

        return Response({
            "pending_cases": CaseReview.objects.filter(status="pending").count(),
            "reviewed_cases": CaseReview.objects.filter(status="reviewed").count(),
            "closed_cases": CaseReview.objects.filter(status="closed").count(),
        })


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Only admins allowed"}, status=403)

        return Response({
            "total_users": User.objects.count(),
            "total_predictions": Prediction.objects.count(),
            "total_cases": CaseReview.objects.count()
        })

# =================================================
# OWNER HEALTH RECORDS
# =================================================
class OwnerHealthRecordsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "owner":
            return Response({"error": "Only owners allowed"}, status=403)

        predictions = Prediction.objects.filter(
            owner=request.user
        ).order_by("-created_at")

        data = []

        for p in predictions:
            data.append({
                "id": p.id,
                "animal": p.animal.name if p.animal else p.quick_species,
                "predicted_disease": p.ai_predicted_name,
                "severity": p.severity,
                "confidence": p.confidence_score,
                "created_at": p.created_at
            })

        return Response(data)


# =================================================
# PREDICTION DETAIL VIEW
# =================================================
class PredictionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            prediction = Prediction.objects.get(
                id=pk,
                owner=request.user
            )
        except Prediction.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        return Response({
            "id": prediction.id,
            "animal": prediction.animal.name if prediction.animal else prediction.quick_species,
            "predicted_disease": prediction.ai_predicted_name,
            "severity": prediction.severity,
            "confidence": prediction.confidence_score,
            "description": prediction.disease_description,
            "symptoms_analysis": prediction.symptoms_analysis,
            "recommended_treatment": prediction.recommended_treatment,
            "suggested_medication": prediction.suggested_medication,
            "prevention_tips": prediction.prevention_tips,
            "additional_notes": prediction.additional_notes,
            "home_care": prediction.home_care,
            "emergency": prediction.emergency_flag,
            "created_at": prediction.created_at
        })
        
# =================================================
# RISK PREDICTION VIEW
# =================================================
class RiskPredictionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        animal_id = request.data.get("animal_id")
        symptoms = request.data.get("symptoms", "")

        animal = Animal.objects.get(id=animal_id)

        result = predict_risk(animal, symptoms)

        return Response(result)
# =================================================
# OUTBREAK HEATMAP VIEW
# =================================================
BASE_DIR = os.path.dirname(__file__)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "ai_services/datasets/risk_prediction.csv"
)


class OutbreakHeatmapView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        df = pd.read_csv(DATASET_PATH)

        region_risk = {}

        for _, row in df.iterrows():

            region = row.get("admin_division", "Unknown")

            cases = row.get("cases", 0)
            deaths = row.get("deaths", 0)

            risk_score = cases + deaths * 2

            region_risk[region] = region_risk.get(region, 0) + risk_score

        results = []

        for region, score in region_risk.items():

            if score > 200:
                level = "high"
            elif score > 100:
                level = "medium"
            else:
                level = "low"

            results.append({
                "region": region,
                "risk_score": score,
                "risk_level": level
            })

        return Response(results)