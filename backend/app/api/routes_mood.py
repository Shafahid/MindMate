from fastapi import APIRouter, HTTPException, status
from app.services.moderation_service import ensemble_mood
from app.models.models import MoodEntryRequest
import uuid
from datetime import datetime, timedelta

router = APIRouter()


@router.post("/mood", response_model=dict)
async def submit_mood(payload: MoodEntryRequest):
    mood_text = payload.mood_text
    user_id = payload.user_id

    # Validate input
    if not mood_text or not mood_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "Mood text cannot be empty."}
        )

    # Run sentiment analysis
    try:
        label, confidence = await ensemble_mood(mood_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": f"Sentiment analysis failed: {str(e)}"}
        )

    fake_entry_id = str(uuid.uuid4())
    return {
        "status": "success",
        "entry_id": fake_entry_id,
        "label": label,
        "confidence": confidence,
        "reason": "Mood detected successfully"
    }


@router.get("/mood/history", response_model=list)
async def mood_history(period: str = "week"):
    now = datetime.now()

    # Simulate filtering by period
    if period == "day":
        days = 1
    elif period == "month":
        days = 30
    else:  # default = week
        days = 7

    fake_entries = [
        {
            "id": str(uuid.uuid4()),
            "mood_text": "happy" if i % 2 == 0 else "sad",
            "mood_label": "positive" if i % 2 == 0 else "negative",
            "confidence": 0.85 if i % 2 == 0 else 0.78,
            "created_at": (now - timedelta(days=i)).isoformat()
        } for i in range(days)
    ]

    return fake_entries
