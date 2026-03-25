from django.urls import path
from .views import MyNotificationsView, MarkNotificationReadView

urlpatterns = [
    path("my/", MyNotificationsView.as_view()),
    path("read/<int:notification_id>/", MarkNotificationReadView.as_view()),
]