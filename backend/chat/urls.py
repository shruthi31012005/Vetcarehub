from django.urls import path
from .views import AIChatView

urlpatterns = [
    path("ai/", AIChatView.as_view()),
]