from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer


# ---------------------------------------------
# Get My Notifications
# ---------------------------------------------
class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = Notification.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


# ---------------------------------------------
# Mark Notification as Read
# ---------------------------------------------
class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)

        notification.is_read = True
        notification.save()

        return Response({"message": "Notification marked as read"})