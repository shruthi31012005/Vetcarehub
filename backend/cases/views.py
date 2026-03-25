from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .models import Case
from .serializers import CaseSerializer
from rest_framework import status



class VetCasesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)
        cases = Case.objects.all().order_by("-created_at")
        serializer = CaseSerializer(cases, many=True)
        return Response(serializer.data)


# Detail view for vet to review/update a case
from rest_framework.generics import get_object_or_404

class VetCaseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)
        case = get_object_or_404(Case, pk=pk)
        serializer = CaseSerializer(case)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role != "vet":
            return Response({"error": "Only vets allowed"}, status=403)
        case = get_object_or_404(Case, pk=pk)
        serializer = CaseSerializer(case, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)