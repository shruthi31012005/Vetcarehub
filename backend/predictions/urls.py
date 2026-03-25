from django.urls import path
from .views import (
    OwnerHealthRecordsView,
    PredictDiseaseView,
    PredictionDetailView,
    SubmitCaseForReviewView,
    VetPendingCasesView,
    VetReviewCaseView,
    OwnerCaseStatusView,
    VetCloseCaseView,
    VetReviewedCasesView,
    AIVetAccuracyView,
    OwnerDashboardView,
    VetDashboardView,
    AdminDashboardView,
    QuickPredictionView,
    RiskPredictionView,
    OutbreakHeatmapView
)

urlpatterns = [

    # AI Prediction
    path('predict/', PredictDiseaseView.as_view(), name='predict-disease'),
    
    #Disease prediction 
    path("predict/", PredictDiseaseView.as_view()),

    # Quick prediction
    path('quick/', QuickPredictionView.as_view(), name='quick-prediction'),

    # Owner submits case for vet review
    path('submit/<int:prediction_id>/', SubmitCaseForReviewView.as_view(), name='submit-case'),

    # Vet views pending cases
    path('vet/pending/', VetPendingCasesView.as_view(), name='vet-pending-cases'),

    # Vet reviews a case
    path('vet/review/<int:case_id>/', VetReviewCaseView.as_view(), name='vet-review-case'),

    # Vet closes a case
    path('vet/close/<int:case_id>/', VetCloseCaseView.as_view(), name='vet-close-case'),

    # Owner views case status
    path('owner/cases/', OwnerCaseStatusView.as_view(), name='owner-case-status'),

    # Vet reviewed history
    path('vet/reviewed/', VetReviewedCasesView.as_view(), name='vet-reviewed-cases'),

    # AI vs Vet accuracy comparison
    path('analytics/ai-vet-accuracy/', AIVetAccuracyView.as_view(), name='ai-vet-accuracy'),

    # Dashboards
    path('dashboard/owner/', OwnerDashboardView.as_view()),
    path('dashboard/vet/', VetDashboardView.as_view()),
    path('dashboard/admin/', AdminDashboardView.as_view()),
    
    #owner health records view
    path('owner/health-records/<int:pk>/', PredictionDetailView.as_view()),
    
    #risk prediction
    path("risk/", RiskPredictionView.as_view(), name="risk-prediction"),
    
    #heatmap
    path("risk-heatmap/", OutbreakHeatmapView.as_view(), name="risk-heatmap"),
    
    
    #owner health records
    path('owner/health-records/', OwnerHealthRecordsView.as_view(), name='owner-health-records'),
]