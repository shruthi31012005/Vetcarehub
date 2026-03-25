from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.utils import translation
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class ChangeLanguageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        lang = request.data.get("language")

        if lang not in ['en', 'hi', 'te']:
            return Response({"error": "Invalid language"}, status=400)

        request.user.preferred_language = lang
        request.user.save()

        translation.activate(lang)

        return Response({
            "message": f"Language changed to {lang}"
        })
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "role": request.user.role,
        "email": request.user.email,
    })