import joblib
import os
import numpy as np

# ------------------------------------------------
# Model paths
# ------------------------------------------------

BASE_DIR = os.path.dirname(__file__)

DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_model.pkl")
RISK_MODEL_PATH = os.path.join(BASE_DIR, "models", "risk_model.pkl")

# ------------------------------------------------
# Load models safely
# ------------------------------------------------

disease_model = None
risk_model = None

if os.path.exists(DISEASE_MODEL_PATH):
    disease_model = joblib.load(DISEASE_MODEL_PATH)

if os.path.exists(RISK_MODEL_PATH):
    risk_model = joblib.load(RISK_MODEL_PATH)


# ------------------------------------------------
# Disease Prediction
# ------------------------------------------------

def predict_disease(features):

    if disease_model is None:
        return None, 0

    prediction = disease_model.predict([features])[0]

    confidence = round(
        np.max(disease_model.predict_proba([features])) * 100,
        2
    )

    return prediction, confidence


# ------------------------------------------------
# Risk Prediction
# ------------------------------------------------

def predict_risk(features):

    if risk_model is None:
        return None

    prediction = risk_model.predict([features])[0]

    return prediction


# ------------------------------------------------
# Explanation Generator
# ------------------------------------------------

def generate_offline_explanation(animal, disease, confidence):

    disease_name = disease.name if hasattr(disease, "name") else str(disease)

    severity = getattr(disease, "severity", "unknown")

    animal_name = getattr(animal, "name", "Animal")

    explanation = f"""
Disease Detected: {disease_name}

Based on the provided symptoms and animal profile, the system predicts
a {confidence}% likelihood of {disease_name} for {animal_name}.

Severity Level: {severity.upper()}

Recommended Immediate Actions:
- Isolate the animal if the disease is contagious.
- Monitor temperature, appetite, and hydration levels.
- Reduce physical stress on the animal.
- Contact a veterinarian for professional diagnosis.

Preventive Measures:
- Maintain proper farm or shelter hygiene.
- Ensure vaccination schedule is up to date.
- Provide balanced nutrition and clean drinking water.
- Conduct regular health checkups.

System Note:
This explanation was generated using the offline AI prediction model.
For confirmation and treatment, consult a certified veterinarian.
"""

    return explanation.strip()


# ------------------------------------------------
# Full Offline AI Pipeline
# ------------------------------------------------

def run_offline_ai(animal, features, disease_obj=None):

    disease_prediction, confidence = predict_disease(features)

    risk_prediction = predict_risk(features)

    explanation = generate_offline_explanation(
        animal,
        disease_obj if disease_obj else disease_prediction,
        confidence
    )

    return {
        "disease": disease_prediction,
        "confidence": confidence,
        "risk_level": risk_prediction,
        "explanation": explanation
    }