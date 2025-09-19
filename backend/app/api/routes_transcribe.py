from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcribe_service import transcribe_audio

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/webm",
    "audio/ogg",
    "audio/mp4",  # covers m4a
}


@router.post("/transcribe", response_model=dict, status_code=200)
async def transcribe(file: UploadFile = File(...)):
    """
    Transcribe an uploaded audio file using Hugging Face Whisper model.
    """
    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
                   f"Allowed: {', '.join(ALLOWED_MIME_TYPES)}"
        )

    file_bytes = await file.read()
    result = await transcribe_audio(file_bytes)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result
