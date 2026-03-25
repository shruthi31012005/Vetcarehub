def analyze_prediction_risk(confidence, severity):

    if confidence >= 90:
        confidence_level = "Very High"

    elif confidence >= 75:
        confidence_level = "High"

    elif confidence >= 50:
        confidence_level = "Moderate"

    else:
        confidence_level = "Low"


    warning = None

    if confidence < 50:
        warning = "⚠️ AI prediction confidence is low. Veterinary consultation recommended."

    if severity and severity.lower() == "severe":
        warning = "🚨 Severe disease detected. Immediate veterinary care required."


    return {
        "confidence_level": confidence_level,
        "warning": warning
    }