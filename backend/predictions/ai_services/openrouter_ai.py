import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def generate_openrouter_prediction(animal, symptoms):

    species = getattr(animal, "species", "animal")

    prompt = f"""
You are a veterinary diagnostic AI.

Return ONLY JSON.

Format:

{{
"predicted_disease": "...",
"confidence": 0-100,
"severity": "Low / Moderate / Severe",

"description": "...",
"symptoms_analysis": "...",
"recommended_treatment": "...",
"suggested_medication": "...",
"prevention_tips": "...",
"additional_notes": "...",
"home_care": "...",
"emergency": true/false
}}

Animal: {species}
Symptoms: {symptoms}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        },
        timeout=30
    )

    data = response.json()

    return data["choices"][0]["message"]["content"]