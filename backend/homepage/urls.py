from django.urls import path
from .views import public_home_stats

urlpatterns = [
    path("public-home/", public_home_stats),
]