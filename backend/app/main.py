import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_peer import router as peer_router
from app.api.routes_mood import router as mood_router
from app.api.routes_chat import router as chat_router
from app.api.routes_transcribe import router as transcribe_router
from app.api.chat_voice import router as voice_router

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(peer_router)
app.include_router(mood_router)
app.include_router(chat_router)
app.include_router(transcribe_router)
app.include_router(voice_router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
