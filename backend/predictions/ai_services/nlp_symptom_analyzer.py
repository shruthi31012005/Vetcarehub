import re

# dataset symptoms
SYMPTOMS = [
    "appetite loss",
    "vomiting",
    "diarrhea",
    "cough",
    "labored breathing",
    "lameness",
    "skin lesions",
    "nasal discharge",
    "eye discharge",
    "fever"
]


def extract_symptoms(text):

    text = text.lower()

    detected = []

    for symptom in SYMPTOMS:

        words = symptom.split()

        # check if all words exist
        if all(word in text for word in words):
            detected.append(symptom)

        # fuzzy matching
        elif re.search(symptom.replace(" ", ".*"), text):
            detected.append(symptom)

    return list(set(detected))