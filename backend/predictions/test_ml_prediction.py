import joblib
from ai_services.feature_builder import build_features


class Animal:

    def __init__(self, species):

        self.species = species
        self.gender = "male"
        self.age_years = 4
        self.weight = 22


# Load model
model = joblib.load("ai_services/models/disease_model.pkl")

label_encoder = joblib.load(
    "ai_services/models/disease_label_encoder.pkl"
)


test_cases = [

    ("dog", "fever, coughing"),

    ("dog", "vomiting, diarrhea"),

    ("cow", "fever, nasal discharge"),

    ("goat", "skin lesions, eye discharge"),

    ("dog", "lameness, fever")
]


for species, symptoms in test_cases:

    print("\n===================================")
    print("Testing animal:", species)
    print("Symptoms:", symptoms)

    animal = Animal(species)

    features = build_features(animal, symptoms)

    # Get probabilities
    probabilities = model.predict_proba(features)[0]

    # Top 3 predictions
    top_indices = probabilities.argsort()[-3:][::-1]
    top_probs = probabilities[top_indices]
    normalized_probs = top_probs / top_probs.sum()

    print("\nTop 3 Predicted Diseases:\n")

    for rank, idx in enumerate(top_indices, start=1):

        disease = label_encoder.inverse_transform([idx])[0]

        confidence = normalized_probs[rank -1] * 100

        print(f"{rank}. {disease} — {round(confidence,2)} %")