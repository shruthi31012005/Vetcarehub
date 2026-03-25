from django.urls import path
from .views import AnimalListCreateView, AnimalDetailView
from . import views 
from .views import animal_dashboard
urlpatterns = [
    path('', AnimalListCreateView.as_view(), name='animal-list-create'),
    path('<int:pk>/', AnimalDetailView.as_view(), name='animal-detail'),
    path('dashboard/<int:animal_id>/', animal_dashboard, name='animal-dashboard'),
]