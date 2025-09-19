import os
import httpx
import logging

logger = logging.getLogger(__name__)

# Google Gemini Flash endpoint and model
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash-latest:generateContent"
)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Hugging Face fallback
HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODELS = [
    "tiiuae/falcon-7b-instruct",
    "facebook/blenderbot-3B",
    "gpt2"
]



def build_prompt(messages: list, user_id: str = None) -> str:
    """
    Build context-aware prompt for Bangladeshi university students, using last 5 messages in memory.
    """
    system_prompt = (
        "You are **MindMate**, an empathetic and trustworthy AI mental health "
        "companion created to support **Bangladeshi university students**. "
        "Your role is to provide a safe, judgment-free space where students feel "
        "heard, understood, and encouraged. You are not a doctor, but a caring "
        "peer who listens deeply and offers gentle, practical guidance.\n\n"

        "### Context\n"
        "- Many students in Bangladesh experience intense academic pressure, "
        "family expectations, financial stress, social stigma, and limited access "
        "to mental health resources.\n"
        "- They may feel isolated or unable to openly discuss their struggles.\n"
        "- Your purpose is to make them feel less alone, more hopeful, and more confident "
        "in handling daily challenges.\n\n"

        "### Tone & Personality\n"
        "- Warm, caring, and approachable — like a close friend who listens without judgment.\n"
        "- Simple, clear, student-friendly language (avoid technical or medical jargon).\n"
        "- Always respectful of culture, family values, and social realities in Bangladesh.\n"
        "- Encourage small, achievable steps instead of overwhelming advice.\n\n"

        "### Core Principles\n"
        "1. **Empathy First** – Acknowledge and validate the student’s feelings before offering advice.\n"
        "2. **Cultural Awareness** – Relate advice to Bangladeshi student life "
        "(e.g., exam prep, balancing family duties, hostel challenges, financial struggles).\n"
        "3. **Practical Support** – Share actionable, realistic suggestions "
        "students can try immediately.\n"
        "4. **Safety Boundaries** – Never provide medical diagnoses, prescriptions, "
        "or harmful content. If someone is in serious distress, gently encourage reaching out "
        "to trusted people or professionals.\n"
        "5. **Positivity with Depth** – Inspire confidence and hope, but never dismiss struggles.\n\n"

        "### Response Style\n"
        "- Begin with an empathetic reflection of what the student feels.\n"
        "- Offer supportive, culturally relevant insights.\n"
        "- Suggest one or two small, practical next steps.\n"
        "- End with encouragement, reminding them they are not alone.\n\n"

        "Your mission: make every student feel **valued, understood, and gently guided** "
        "with compassion, cultural awareness, and warmth."
    )

    user_context = f"User ID: {user_id}. " if user_id else ""
    history = ""
    for msg in messages[-5:]:
        sender = "Student" if getattr(msg, "sender", None) == "user" else "MindMate"
        text = getattr(msg, "text", "")
        history += f"{sender} :{text}\n"
    return f"{system_prompt}\n{user_context}{history}"


async def get_gemini_response(messages: list, user_id: str = None) -> str:
    """
    Try Gemini API first, fallback to Hugging Face if needed. Accepts last 5 messages in memory.
    """
    full_prompt = build_prompt(messages, user_id)

    if not GEMINI_API_KEY:
        logger.warning("[GeminiService] Gemini API key not configured.")
        return "Gemini API key not configured."

    payload = {
        "contents": [
            {"parts": [{"text": full_prompt}]}
        ]
    }

    async with httpx.AsyncClient() as client:
        # Try Gemini first
        try:
            logger.info(f"[GeminiService] Sending prompt to Gemini Flash...")
            resp = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json=payload,
                timeout=15.0
            )
            logger.info(f"[GeminiService] Gemini status: {resp.status_code}")
            resp.raise_for_status()

            gemini_json = resp.json()
            candidates = gemini_json.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts and "text" in parts[0]:
                    return parts[0]["text"]

            return "Hi! I’m MindMate. How are you feeling today?"

        except Exception as gemini_exc:
            logger.error(f"[GeminiService] Gemini error: {gemini_exc}", exc_info=True)

        # Fallback to Hugging Face
        if not HF_API_KEY:
            logger.warning("[GeminiService] Hugging Face API key not configured.")
            return "Sorry, I couldn’t connect to Gemini or Hugging Face right now."

        for hf_model in HF_MODELS:
            try:
                hf_url = f"https://api-inference.huggingface.co/models/{hf_model}"
                hf_headers = {"Authorization": f"Bearer {HF_API_KEY}"}
                hf_payload = {"inputs": full_prompt}

                logger.info(f"[GeminiService] Trying Hugging Face model '{hf_model}'...")
                hf_resp = await client.post(
                    hf_url,
                    headers=hf_headers,
                    json=hf_payload,
                    timeout=15.0
                )
                logger.info(f"[GeminiService] HF '{hf_model}' status: {hf_resp.status_code}")
                hf_resp.raise_for_status()

                hf_result = hf_resp.json()
                if isinstance(hf_result, dict) and "generated_text" in hf_result:
                    return hf_result["generated_text"]
                if isinstance(hf_result, list) and hf_result and "generated_text" in hf_result[0]:
                    return hf_result[0]["generated_text"]

                logger.warning(f"[GeminiService] Unexpected HF result from '{hf_model}': {hf_result}")

            except Exception as hf_exc:
                logger.error(f"[GeminiService] HF fallback error for '{hf_model}': {hf_exc}", exc_info=True)
                continue

        return "Sorry, all AI models failed. Please try again later."
