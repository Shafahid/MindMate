from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
import logging

from app.services.moderation_service import moderate_text
from app.services.gemini_service import get_gemini_response
from app.models.models import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/chat", response_model=ChatResponse, status_code=200)
async def chat_support(payload: ChatRequest):
    """
    Chat endpoint for MindMate.
    - Optionally moderates messages for toxicity
    - Returns AI-generated response
    """
    message = payload.message
    user_id = payload.user_id

    if not message or not message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty.")

    # Optional moderation: reject toxic messages
    label, score = await moderate_text(message)
    if label == "toxic":
        logger.warning(f"[Chat] Rejected toxic message from user {user_id}")
        raise HTTPException(
            status_code=400,
            detail="Message flagged as toxic. Please rephrase."
        )

    # Generate AI response
    try:
        response_text = await get_gemini_response(message, user_id)
    except Exception as exc:
        logger.error(f"[Chat] AI generation error for user {user_id}: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate AI response.")

    return ChatResponse(
        chat_id=str(uuid.uuid4()),
        response=response_text,
    )
