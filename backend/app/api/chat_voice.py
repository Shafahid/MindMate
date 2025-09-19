from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import uuid
import logging

from app.services.transcribe_service import transcribe_audio
from app.services.moderation_service import moderate_text
from app.services.gemini_service import get_gemini_response
from pydantic import BaseModel
from app.models.models import VoiceChatResponse

logger = logging.getLogger(__name__)
router = APIRouter()





@router.post("/chat/voice", response_model=VoiceChatResponse)
async def chat_voice(file: UploadFile = File(...), user_id: Optional[str] = None):
    """
    Endpoint to handle voice messages from frontend:
    1. Transcribe audio
    2. Moderate text
    3. Get AI response from MindMate
    """
    if not file:
        raise HTTPException(status_code=422, detail="No audio file uploaded.")

    try:
        # Step 1: Transcribe
        transcribed_text = (await transcribe_audio(file.file.read(), file.content_type)).get("text", "")
        if not transcribed_text.strip():
            raise HTTPException(status_code=422, detail="Transcription failed or empty.")

        # Step 2: Moderate
        label, score = await moderate_text(transcribed_text)
        if label == "toxic":
            logger.warning(f"[ChatVoice] Rejected toxic message from user {user_id}")
            raise HTTPException(
                status_code=400,
                detail="Message flagged as toxic. Please rephrase."
            )

        # Step 3: Generate AI response
        ai_response = await get_gemini_response(transcribed_text, user_id)

        return VoiceChatResponse(
            chat_id=str(uuid.uuid4()),
            transcribed_text=transcribed_text,
            ai_response=ai_response
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"[ChatVoice] Error processing voice chat: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process voice message.")
