import os
import requests
from google import genai

# =====================================================
# API KEYS
# =====================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Initialize Gemini only if key exists
gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


# =====================================================
# MAIN AI FUNCTION
# =====================================================

def generate_chat_response(user_role, message, language="en"):

    # -------------------------------------------------
    # Language Mapping
    # -------------------------------------------------

    language_map = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu"
    }

    target_language = language_map.get(language, "English")

    # -------------------------------------------------
    # Role Based Prompts
    # -------------------------------------------------

    if user_role == "owner":

        system_prompt = """
You are a veterinary AI assistant helping pet owners.

Explain things simply and clearly.

Always format your answer using Markdown.

Use:
- Bold headings
- Bullet points
- Line breaks

Example format:

Condition
Short explanation.

Common Symptoms
- Symptom 1
- Symptom 2
- Symptom 3

Recommended Actions
- Action 1
- Action 2

Always advise consulting a veterinarian for serious cases.
"""

    elif user_role == "vet":

        system_prompt = """
You are an advanced veterinary clinical assistant.

Provide structured medical explanations.

Format responses using Markdown.

**Diagnosis**
Explanation

**Clinical Signs**
- Sign 1
- Sign 2

**Treatment Suggestions**
- Treatment 1
- Treatment 2
"""

    elif user_role == "admin":

        system_prompt = """
You are an AI assistant helping with veterinary platform analytics.

Provide structured answers with headings and bullet points.
"""

    else:

        system_prompt = "You are a helpful assistant."

    # -------------------------------------------------
    # Full Prompt
    # -------------------------------------------------

    full_prompt = f"""
Respond strictly in {target_language}.

{system_prompt}

User Question:
{message}
"""

    # =====================================================
    # 1️⃣ TRY GEMINI FIRST
    # =====================================================

    if gemini_client:

        try:

            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt
            )

            if response and response.candidates:
                print("Using Gemini AI")

                return response.candidates[0].content.parts[0].text.strip()

        except Exception as e:
            print("Gemini failed:", e)

    # =====================================================
    # 2️⃣ TRY OPENROUTER FREE MODELS
    # =====================================================

    openrouter_models = [
        "deepseek/deepseek-r1:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "qwen/qwen2:free"
    ]

    if OPENROUTER_API_KEY:

        for model in openrouter_models:

            try:

                response = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "VetCareHub AI"
                    },
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": full_prompt}
                        ]
                    },
                    timeout=30
                )

                data = response.json()

                if "choices" in data and len(data["choices"]) > 0:

                    print(f"Using OpenRouter model: {model}")

                    return data["choices"][0]["message"]["content"].strip()

            except Exception as e:
                print(f"OpenRouter model {model} failed:", e)

    # =====================================================
    # FINAL FALLBACK RESPONSE
    # =====================================================

    return f"""
**AI Service Temporary Notice**

⚠️ The AI service is currently unavailable.

However, based on general veterinary guidance:

**Your Question**
{message}

**Basic Advice**
- Monitor the animal carefully
- Ensure proper hydration and nutrition
- Maintain a clean environment
- Seek professional veterinary consultation if symptoms worsen

*This is a temporary fallback response.*
"""