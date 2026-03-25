import os
from google import genai


def generate_online_prediction(animal, symptoms):

    client = genai.Client(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"""
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

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
)

    return response.text