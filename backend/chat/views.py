from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatMessage
from .ai_chat_service import generate_chat_response


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        message = request.data.get("message")

        if not message:
            return Response({"error": "Message is required"}, status=400)

        user_role = request.user.role

        ai_response = generate_chat_response(user_role, message, request.user.preferred_language)

        ChatMessage.objects.create(
            user=request.user,
            role=user_role,
            message=message,
            response=ai_response
        )

        return Response({
            "role": user_role,
            "message": message,
            "response": ai_response
        })