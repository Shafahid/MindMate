from pydantic import BaseModel

class ModerateRequest(BaseModel):
    text: str

class ModerateResponse(BaseModel):
    status: str

class MoodRequest(BaseModel):
    emoji: str
    text: str
    slider: int

class MoodResponse(BaseModel):
    message: str
