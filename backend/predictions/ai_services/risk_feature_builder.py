import pandas as pd
import os
import joblib

BASE_DIR = os.path.dirname(__file__)

FEATURE_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk_feature_columns.pkl"
)

feature_columns = joblib.load(FEATURE_PATH)


def build_risk_features(animal, symptoms_text):

    data = dict.fromkeys(feature_columns, 0)

    # -----------------------
    # Animal info
    # -----------------------

    if "species_name_" + animal.species in data:
        data["species_name_" + animal.species] = 1

    if "is_domestic" in data:
        data["is_domestic"] = 1

    if "is_wild" in data:
        data["is_wild"] = 0

    # -----------------------
    # Symptoms
    # -----------------------

    symptoms = symptoms_text.lower()

    if "fever" in symptoms:
        data["cases"] = 1

    if "death" in symptoms or "weak" in symptoms:
        data["deaths"] = 1

    # -----------------------
    # Convert to dataframe
    # -----------------------

    df = pd.DataFrame([data])

    return df