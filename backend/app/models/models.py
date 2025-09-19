from pydantic import BaseModel, Field as PydanticField
from typing import Optional
class PeerPostRequest(BaseModel):
    user_id: Optional[str] = PydanticField(None, description="User ID")
    content: str = PydanticField(..., min_length=1, description="Text content to be moderated. Can include emojis.")

class PeerPostResponse(BaseModel):
    post_id: str
    status: str
    model_label: str
    confidence: float
    reason: Optional[str] = None

class MoodEntryRequest(BaseModel):
    user_id: Optional[str] = PydanticField(None, description="User ID")
    mood_text: str = PydanticField(..., min_length=1, description="Text or emoji representing your mood.")

class MoodEntryResponse(BaseModel):
    entry_id: str
    status: str
    mood_label: str
    confidence: float

class ChatRequest(BaseModel):
    user_id: Optional[str] = PydanticField(None, description="User ID")
    message: str = PydanticField(..., min_length=1, description="User's chat message. Can include emojis.")

class ChatResponse(BaseModel):
    chat_id: str
    response: str

# Response model
class VoiceChatResponse(BaseModel):
    chat_id: str
    transcribed_text: str
    ai_response: str