import os
import tempfile
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

HF_API_KEY = settings.HF_API_KEY
API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo"

HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}"
}


async def transcribe_audio(file_bytes: bytes, content_type: str = "audio/webm") -> dict:
    """
    Send audio bytes to Hugging Face Whisper API for transcription.
    Handles dynamic content types (mp3, wav, webm).
    """
    tmp_path = None
    try:
        # Choose suffix based on MIME type
        suffix = guess_suffix(content_type)

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        async with httpx.AsyncClient(timeout=90.0) as client:
            with open(tmp_path, "rb") as f:
                response = await client.post(
                    API_URL,
                    headers={**HEADERS, "Content-Type": content_type},
                    content=f.read()  # raw audio upload
                )

        logger.info(f"[TranscribeService] HF status={response.status_code}")

        if response.status_code != 200:
            return {"error": response.text}

        result = response.json()
        logger.debug(f"[TranscribeService] HF response JSON: {result}")

        return {"text": result.get("text", "")}

    except Exception as exc:
        logger.error(f"[TranscribeService] Exception: {exc}", exc_info=True)
        return {"error": str(exc)}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


def guess_suffix(content_type: str) -> str:
    """Return file extension based on MIME type."""
    mapping = {
        "audio/webm": ".webm",
        "audio/mpeg": ".mp3",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
        "audio/ogg": ".ogg"
    }
    return mapping.get(content_type, ".tmp")
