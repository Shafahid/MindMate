from app.services.moderation_service import analyze_mood
from app.db import get_session
from backend.app.models.models import MoodEntry
from fastapi import Depends

async def create_mood_entry(user_id, mood_text, session=Depends(get_session)):
    label, confidence = await analyze_mood(mood_text)
    entry = MoodEntry(user_id=user_id, mood_text=mood_text, mood_label=label, confidence=confidence)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry

async def get_mood_history(user_id, period="week", session=Depends(get_session)):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    if period == "week":
        start = now - timedelta(days=7)
    elif period == "month":
        start = now - timedelta(days=30)
    else:
        start = now - timedelta(days=7)
    entries = session.query(MoodEntry).filter(MoodEntry.user_id==user_id, MoodEntry.created_at>=start).all()
    return entries
