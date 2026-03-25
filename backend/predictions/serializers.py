from rest_framework import serializers
from .models import Prediction
from .models import CaseReview


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'
        read_only_fields = ['owner', 'confidence_score', 'predicted_disease']

class CaseReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = CaseReview
        fields = "__all__"