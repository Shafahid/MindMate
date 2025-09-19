from fastapi import APIRouter, HTTPException, status
from app.models.models import PeerPostRequest
from app.services.moderation_service import moderate_text
import uuid

router = APIRouter()


@router.post("/peer", response_model=dict)
async def submit_peer_post(payload: PeerPostRequest):
    content = payload.content
    user_id = payload.user_id

    # Validate empty content
    if not content or not content.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "Content cannot be empty."}
        )

    # Run moderation
    label, score = await moderate_text(content)

    # Always generate post ID (accepted or rejected, for audit)
    fake_post_id = str(uuid.uuid4())

    # Reject toxic posts
    if label == "toxic":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "status": "rejected",
                "post_id": fake_post_id,
                "reason": "Please change your text, it doesn’t meet community standards",
                "model_label": label,
                "confidence": score
            }
        )

    # Accept non-toxic posts
    return {
        "status": "accepted",
        "post_id": fake_post_id,
        "reason": "Passed moderation",
        "model_label": label,
        "confidence": score
    }
