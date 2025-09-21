import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_peer import router as peer_router
from app.api.routes_mood import router as mood_router
from app.api.routes_chat import router as chat_router
from app.api.routes_transcribe import router as transcribe_router
from app.api.chat_voice import router as voice_router
from app.api.routes_comment import router as comment_router

app = FastAPI(
    title="MindMate API",
    description="Backend API for MindMate mental health platform",
    version="1.0.0",
    root_path=os.environ.get("RENDER_EXTERNAL_URL", "")
)


PORT = int(os.getenv("PORT", 8000))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")


allowed_origins = [
    "http://localhost:3000",  # Development frontend
    "https://*.vercel.app",   # Vercel deployments
]


if ENVIRONMENT == "production":
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        allowed_origins.append(frontend_url)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(peer_router)
app.include_router(mood_router)
app.include_router(chat_router)
app.include_router(transcribe_router)
app.include_router(voice_router)
app.include_router(comment_router)

@app.get("/")
async def root():
    return {"message": "MindMate API is running!", "environment": ENVIRONMENT}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": ENVIRONMENT}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=PORT, 
        reload=ENVIRONMENT == "development"
    )
