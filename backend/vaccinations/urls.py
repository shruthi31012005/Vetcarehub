from django.urls import path
from .views import (
    AddVaccinationView,
    OwnerVaccinationsView,
    UpcomingVaccinationsView,
    OverdueVaccinationsView,
    VaccinationListCreateView,
    VaccinationDetailView,
    VetVaccinationsView,
)

urlpatterns = [
    path("add/", AddVaccinationView.as_view()),
    path("all/", OwnerVaccinationsView.as_view()),
    path("upcoming/", UpcomingVaccinationsView.as_view()),
    path("overdue/", OverdueVaccinationsView.as_view()),
    path("", VaccinationListCreateView.as_view(), name="vaccinations"),
    path("<int:pk>/", VaccinationDetailView.as_view(), name="vaccination-detail"),
    path("vet/", VetVaccinationsView.as_view(), name="vet-vaccinations"),
    
]
