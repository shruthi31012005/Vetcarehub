from django.urls import path
from .views import (
    BookAppointmentView,
    RejectAppointmentView,
    VetPendingAppointmentsView,
    ConfirmAppointmentView,
    CompleteAppointmentView,
    AppointmentListView,
    CancelAppointmentView
)

urlpatterns = [
    path("book/", BookAppointmentView.as_view()),
    path("vet/pending/", VetPendingAppointmentsView.as_view()),
    path("vet/confirm/<int:appointment_id>/", ConfirmAppointmentView.as_view()),
    path("vet/complete/<int:appointment_id>/", CompleteAppointmentView.as_view()),
    path("cancel/<int:appointment_id>/", CancelAppointmentView.as_view()),
    path("confirm/<int:appointment_id>/", ConfirmAppointmentView.as_view()),
    path("complete/<int:appointment_id>/", CompleteAppointmentView.as_view()),
    path("reject/<int:appointment_id>/", RejectAppointmentView.as_view()),
    path("list/", AppointmentListView.as_view()),]