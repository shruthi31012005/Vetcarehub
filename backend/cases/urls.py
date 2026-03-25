from django.urls import path
from .views import VetCasesView, VetCaseDetailView

urlpatterns = [

    path("vet/", VetCasesView.as_view(), name="vet-cases"),
    path("vet/<int:pk>/", VetCaseDetailView.as_view(), name="vet-case-detail"),

]