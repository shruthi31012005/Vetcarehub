from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def public_home_stats(request):
    data = {
        "animals_assisted": "10k+",
        "accuracy": "95%",
        "vets_connected": "500+",
    }
    return Response(data)