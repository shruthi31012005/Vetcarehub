import os
from google import genai
from google.genai import types


def generate_vision_prediction(animal, symptoms, image_file):

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    image_bytes = image_file.read()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=image_file.content_type
            ),
            f"""

You are a professional veterinary AI assistant.

Analyze the following case carefully.

Species: {animal.species}
Symptoms: {symptoms}

Return your answer strictly in this JSON format:

{{
  "predicted_disease": "Disease name",
  "severity": "Low / Moderate / Severe",
  "confidence": 0-100,
  "description": "Detailed professional medical explanation of the disease",
  "symptoms_analysis": "Explain how the symptoms relate to the disease",
  "recommended_treatment": "Professional treatment plan explanation",
  "suggested_medication": "Possible medications with explanation",
  "prevention_tips": "Preventive steps",
  "additional_notes": "Important notes for the owner",
  "home_care": "Immediate home care guidance",
  "emergency": true or false
}}

Be medically accurate, clear, and professional.
Do not include extra text outside JSON.
"""
        ]
    )

    return response.text