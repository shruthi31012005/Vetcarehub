import pandas as pd
import joblib
import os

BASE_DIR = os.path.dirname(__file__)

# Load training feature columns
feature_columns = joblib.load(
    os.path.join(BASE_DIR, "models/feature_columns.pkl")
)


def build_features(animal, symptoms_text):

    # Create empty feature vector
    data = dict.fromkeys(feature_columns, 0)

    species = getattr(animal, "species", "").lower()
    gender = getattr(animal, "gender", "").lower()

    # One-hot species
    species_col = f"Animal_Type_{species.capitalize()}"
    if species_col in data:
        data[species_col] = 1

    # One-hot gender
    gender_col = f"Gender_{gender.capitalize()}"
    if gender_col in data:
        data[gender_col] = 1

    # Numeric features
    if "Age" in data:
        data["Age"] = getattr(animal, "age_years", 0)

    if "Weight" in data:
        data["Weight"] = getattr(animal, "weight", 0)

    # Symptoms
    symptoms = [s.strip().lower() for s in symptoms_text.split(",")]

    for i in range(1, 5):

        col = f"Symptom_{i}"

        if col in data and len(symptoms) >= i:
            data[col] = symptoms[i - 1]

    df = pd.DataFrame([data])

    return df