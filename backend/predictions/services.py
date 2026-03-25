import os
import joblib
import pandas as pd

from diseases.models import Disease
from .ai_services.feature_builder import build_features


# =========================================================
# BASE DIRECTORY
# =========================================================

BASE_DIR = os.path.dirname(__file__)


# =========================================================
# LOAD ML MODEL
# =========================================================

model = joblib.load(
    os.path.join(BASE_DIR, "ai_services/models/disease_model.pkl")
)

label_encoder = joblib.load(
    os.path.join(BASE_DIR, "ai_services/models/disease_label_encoder.pkl")
)


# =========================================================
# LOAD DATASET FOR SIMILARITY SEARCH
# =========================================================

DATASET_PATH = os.path.join(
    BASE_DIR,
    "ai_services/datasets/cleaned_animal_disease_prediction.csv"
)

dataset = pd.read_csv(DATASET_PATH)


# =========================================================
# SIMILARITY SCORING (CASE-BASED REASONING)
# =========================================================

def similarity_score(symptoms_text):

    user_symptoms = [
        s.strip().lower()
        for s in symptoms_text.split(",")
        if s.strip()
    ]

    scores = {}

    for _, row in dataset.iterrows():

        disease = row["Disease_Prediction"]

        case_symptoms = []

        for i in range(1, 5):

            value = row.get(f"Symptom_{i}")

            if pd.notna(value):
                case_symptoms.append(str(value).lower())

        if not case_symptoms:
            continue

        match = len(set(user_symptoms) & set(case_symptoms))

        score = match / len(case_symptoms)

        scores[disease] = scores.get(disease, 0) + score

    return scores


# =========================================================
# MAIN DISEASE PREDICTION FUNCTION
# =========================================================

def predict_disease(animal, symptoms_text):

    # -----------------------------------------------------
    # Build ML features
    # -----------------------------------------------------

    features = build_features(animal, symptoms_text)


    # -----------------------------------------------------
    # ML probabilities
    # -----------------------------------------------------

    probabilities = model.predict_proba(features)[0]


    # -----------------------------------------------------
    # Top-3 predictions
    # -----------------------------------------------------

    top_indices = probabilities.argsort()[-3:][::-1]

    top_probs = probabilities[top_indices]


    # -----------------------------------------------------
    # Normalize probabilities
    # -----------------------------------------------------

    normalized_probs = top_probs / top_probs.sum()


    # -----------------------------------------------------
    # Symptom similarity scores
    # -----------------------------------------------------

    similarity_scores = similarity_score(symptoms_text)


    # -----------------------------------------------------
    # Parse user symptoms
    # -----------------------------------------------------

    symptoms_list = [
        s.strip().lower()
        for s in symptoms_text.split(",")
        if s.strip()
    ]


    results = []


    # -----------------------------------------------------
    # Build final predictions
    # -----------------------------------------------------

    for i, idx in enumerate(top_indices):

        disease_name = label_encoder.inverse_transform([idx])[0]

        confidence = normalized_probs[i] * 100


        try:

            disease = Disease.objects.get(name__iexact=disease_name)


            # ---------------------------------------------
            # Symptom rule matching
            # ---------------------------------------------

            disease_symptoms = []

            if disease.symptoms:
                disease_symptoms = [
                    s.strip().lower()
                    for s in disease.symptoms.split(",")
                ]


            if disease_symptoms:

                match_count = len(
                    set(symptoms_list) & set(disease_symptoms)
                )

                match_score = match_count / len(disease_symptoms)

                confidence = confidence * (1 + match_score)


            # ---------------------------------------------
            # Dataset similarity boost
            # ---------------------------------------------

            similarity_boost = similarity_scores.get(
                disease_name,
                0
            )

            confidence = confidence * (1 + similarity_boost)


        except Disease.DoesNotExist:

            disease = None


        results.append({

            "disease": disease,
            "name": disease_name,
            "confidence": round(min(confidence, 100), 2)

        })


    # -----------------------------------------------------
    # Confidence warning
    # -----------------------------------------------------

    warning = None

    if results and results[0]["confidence"] < 40:

        warning = (
            "AI confidence is moderate. "
            "Consult a veterinarian for confirmation."
        )


    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return {

        "primary_prediction": results[0] if results else None,

        "top_predictions": results,

        "warning": warning

    }
# import os
# import joblib
# from diseases.models import Disease
# from .ai_services.feature_builder import build_features

# BASE_DIR = os.path.dirname(__file__)

# # Load trained model
# model = joblib.load(
#     os.path.join(BASE_DIR, "ai_services/models/disease_model.pkl")
# )

# label_encoder = joblib.load(
#     os.path.join(BASE_DIR, "ai_services/models/disease_label_encoder.pkl")
# )


# def predict_disease(animal, symptoms_text):

#     features = build_features(animal, symptoms_text)

#     # Predict probabilities
#     probabilities = model.predict_proba(features)[0]

#     # Get top 3 predictions
#     top_indices = probabilities.argsort()[-3:][::-1]
#     top_probs = probabilities[top_indices]
#     normalized_probs = top_probs / top_probs.sum()

#     results = []

#     for i,idx in enumerate(top_indices):

#         disease_name = label_encoder.inverse_transform([idx])[0]

#         confidence = normalized_probs[i] * 100

#         try:
#             disease = Disease.objects.get(name__iexact=disease_name)
#         except Disease.DoesNotExist:
#             disease = None

#         results.append({
#             "disease": disease,
#             "name": disease_name,
#             "confidence": round(confidence, 2)
#         })

#     return results
# from diseases.models import Disease


# def predict_disease(symptoms_text, species):

#     symptoms_list = [
#         s.strip().lower() for s in symptoms_text.split(",") if s.strip()
#     ]

#     diseases = Disease.objects.all()

#     best_match = None
#     best_score = 0

#     for disease in diseases:

#         disease_symptoms = [
#             s.strip().lower() for s in disease.symptoms.split(",")
#         ]

#         if not disease_symptoms:
#             continue

#         match_count = len(set(symptoms_list) & set(disease_symptoms))

#         score = match_count / len(disease_symptoms)

#         if score > best_score:
#             best_score = score
#             best_match = disease

#     # 🎯 Add confidence threshold
#     if best_score >= 0.3:   # 30% minimum match required
#         confidence = round(best_score * 100, 2)
#         return best_match, confidence

#     # ❌ No strong match found
#     return None, 0