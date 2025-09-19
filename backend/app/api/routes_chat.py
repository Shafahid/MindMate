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
    - Accepts last 5 messages for context
    - Optionally moderates latest user message for toxicity
    - Returns AI-generated response
    """
    messages = payload.messages
    user_id = payload.user_id

    if not messages or not isinstance(messages, list) or len(messages) == 0:
        raise HTTPException(status_code=422, detail="Messages cannot be empty.")

    latest_user_msg = next((m for m in reversed(messages) if m.sender == "user"), None)
    if not latest_user_msg or not latest_user_msg.text.strip():
        raise HTTPException(status_code=422, detail="Latest user message cannot be empty.")

    # Optional moderation: reject toxic messages
    label, score = await moderate_text(latest_user_msg.text)
    if label == "toxic":
        logger.warning(f"[Chat] Rejected toxic message from user {user_id}")
        raise HTTPException(
            status_code=400,
            detail="Message flagged as toxic. Please rephrase."
        )

    # Generate AI response
    try:
        response_text = await get_gemini_response(messages, user_id)
    except Exception as exc:
        logger.error(f"[Chat] AI generation error for user {user_id}: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate AI response.")

    return ChatResponse(
        chat_id=str(uuid.uuid4()),
        response=response_text,
    )
