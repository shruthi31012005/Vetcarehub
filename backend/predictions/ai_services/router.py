import os
import json
from .online_ai import generate_online_prediction
from .offline_ai import generate_offline_explanation
from .vision_ai import generate_vision_prediction
from ..services import predict_disease
from .feature_builder import build_features
from .nlp_symptom_analyzer import extract_symptoms
from .openrouter_ai import generate_openrouter_prediction



def handle_prediction(animal, symptoms, image=None):

    api_key = os.getenv("GEMINI_API_KEY")

    # =========================
    # ONLINE MODE
    # =========================
    if api_key:
        try:

            # 🔥 If image exists → Use Gemini Vision
            if image:
                print("🔥 USING GEMINI VISION")
                raw_text = generate_vision_prediction(animal, symptoms, image)

            # 🔥 Otherwise → Use Gemini Text
            else:
                print("🔥 USING GEMINI TEXT")
                raw_text = generate_online_prediction(animal, symptoms)

            start = raw_text.find("{")
            end = raw_text.rfind("}") + 1

            if start != -1 and end != -1:
                json_part = raw_text[start:end]
                parsed = json.loads(json_part)

                return {
                    "mode": "online",
                    "predicted_disease": parsed.get("predicted_disease"),
                    "confidence": float(parsed.get("confidence", 0)),
                    "severity": parsed.get("severity"),

                    "description": parsed.get("description"),
                    "symptoms_analysis": parsed.get("symptoms_analysis"),
                    "recommended_treatment": parsed.get("recommended_treatment"),
                    "suggested_medication": parsed.get("suggested_medication"),
                    "prevention_tips": parsed.get("prevention_tips"),
                    "additional_notes": parsed.get("additional_notes"),
                    "home_care": parsed.get("home_care"),
                    "emergency": parsed.get("emergency", False)
                }

        except Exception as e:
            print("⚠️ Gemini failed:", e)

            # ====================================
            # TRY OPENROUTER
            # ====================================

            try:
                print("🔥 USING OPENROUTER AI")

                raw_text = generate_openrouter_prediction(animal, symptoms)

                start = raw_text.find("{")
                end = raw_text.rfind("}") + 1

                if start != -1 and end != -1:
                    json_part = raw_text[start:end]
                    parsed = json.loads(json_part)

                    return {
                        "mode": "openrouter",
                        "predicted_disease": parsed.get("predicted_disease"),
                        "confidence": float(parsed.get("confidence", 0)),
                        "severity": parsed.get("severity"),

                        "description": parsed.get("description"),
                        "symptoms_analysis": parsed.get("symptoms_analysis"),
                        "recommended_treatment": parsed.get("recommended_treatment"),
                        "suggested_medication": parsed.get("suggested_medication"),
                        "prevention_tips": parsed.get("prevention_tips"),
                        "additional_notes": parsed.get("additional_notes"),
                        "home_care": parsed.get("home_care"),
                        "emergency": parsed.get("emergency", False)
                    }

            except Exception as e:
                print("⚠️ OpenRouter also failed:", e)
    # if api_key:
    #     try:

    #         # 🔥 If image exists → Use Gemini Vision
    #         if image:
    #             print("🔥 USING GEMINI VISION")
    #             raw_text = generate_vision_prediction(animal, symptoms, image)

    #         # 🔥 Otherwise → Use Gemini Text
    #         else:
    #             print("🔥 USING GEMINI TEXT")
    #             raw_text = generate_online_prediction(animal, symptoms)
            

    #         # -----------------------------------------
    #         # Extract JSON safely from AI response
    #         # -----------------------------------------
    #         start = raw_text.find("{")
    #         end = raw_text.rfind("}") + 1

    #         if start != -1 and end != -1:
    #             json_part = raw_text[start:end]
    #             parsed = json.loads(json_part)
    #         else:
    #             raise ValueError("No JSON found in AI response")

    #         return {
    #             "mode": "online",
    #             "predicted_disease": parsed.get("predicted_disease"),
    #             "confidence": float(parsed.get("confidence", 0)),
    #             "severity": parsed.get("severity"),

    #             "description": parsed.get("description"),
    #             "symptoms_analysis": parsed.get("symptoms_analysis"),
    #             "recommended_treatment": parsed.get("recommended_treatment"),
    #             "suggested_medication": parsed.get("suggested_medication"),
    #             "prevention_tips": parsed.get("prevention_tips"),
    #             "additional_notes": parsed.get("additional_notes"),
    #             "home_care": parsed.get("home_care"),
    #             "emergency": parsed.get("emergency", False)
    #         }
            

    #     except Exception as e:
    #         print("⚠️ Online AI failed, switching to offline.")
    #         print("Error:", e)



# =========================
# OFFLINE FALLBACK MODE
# =========================

    print("🧠 USING OFFLINE ML MODEL")

    # 🔹 Step 1: Extract symptoms using NLP
    symptom_list = extract_symptoms(symptoms)

    print("Extracted Symptoms:", symptom_list)

    # 🔹 Step 2: Convert symptoms → ML features
    features = build_features(animal, symptom_list)

    # 🔹 Step 3: ML prediction
    predictions = predict_disease(animal, symptoms)

    best_prediction = predictions[0]
    disease = best_prediction["disease"]
    confidence = best_prediction["confidence"]

    if not disease:
        return {
            "mode": "offline",
            "predicted_disease": None,
            "confidence": 0,
            "severity": None,
            "result": "No strong disease match found. Please consult a veterinarian."
        }

    explanation = generate_offline_explanation(animal, disease, confidence)

    return {
        "mode": "offline",
        "predicted_disease": disease.name,
        "confidence": confidence,
        "severity": disease.severity,
        "description": explanation,
        "symptoms_analysis": f"Symptoms detected: {', '.join(symptom_list)}",
        "recommended_treatment": "Consult veterinarian immediately.",
        "suggested_medication": "Medication depends on vet diagnosis.",
        "prevention_tips": "Maintain hygiene and vaccination schedule.",
        "additional_notes": "Prediction generated using offline ML model.",
        "home_care": "Ensure hydration and isolate if contagious.",
        "emergency": disease.severity == "Severe"
    }