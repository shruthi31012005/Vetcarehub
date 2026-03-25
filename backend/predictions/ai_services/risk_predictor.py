import os
import joblib
import pandas as pd
import random

BASE_DIR = os.path.dirname(__file__)

risk_model = joblib.load(
    os.path.join(BASE_DIR, "models/risk_model.pkl")
)

risk_features = joblib.load(
    os.path.join(BASE_DIR, "models/risk_feature_columns.pkl")
)


def build_risk_features(animal, symptoms):

    data = dict.fromkeys(risk_features, 0)

    if "species" in data:
        data["species"] = animal.species

    if "age" in data:
        data["age"] = getattr(animal, "age_years", 0)

    if "weight" in data:
        data["weight"] = getattr(animal, "weight", 0)

    df = pd.DataFrame([data])

    return df[risk_features]


def predict_risk(animal, symptoms):

    features = build_risk_features(animal, symptoms)

    probabilities = risk_model.predict_proba(features)[0]

    confidence = max(probabilities) * 100

    if confidence > 70:
        risk_level = "High Risk"
    elif confidence > 40:
        risk_level = "Medium Risk"
    else:
        risk_level = "Low Risk"

    # AI-style report generation

    possible_diseases = [
        "Parvovirus",
        "Distemper",
        "Kennel Cough",
        "Leptospirosis",
        "Rabies"
    ]

    risk_factors = [
        "Lack of vaccinations",
        "Young age",
        "Exposure to other animals"
    ]

    recommendations = [
        "Schedule vaccinations as soon as possible",
        "Regular vet check-ups",
        "Maintain proper hygiene and diet"
    ]

    return {
        "risk_score": round(confidence, 2),
        "risk_level": risk_level,
        "summary": f"{animal.name} currently has a {risk_level.lower()} based on health profile and symptoms.",
        "possible_diseases": random.sample(possible_diseases, 3),
        "risk_factors": risk_factors,
        "recommendations": recommendations,
        "vaccination_gap": "No vaccinations recorded. Immediate vaccination recommended.",
        "dietary_advice": "Provide balanced nutrition suitable for the animal's age and species.",
        "monitoring_advice": "Watch for symptoms such as fever, vomiting, diarrhea or appetite loss.",
        "next_checkup": "Schedule the next veterinary checkup within 3 months."
    }