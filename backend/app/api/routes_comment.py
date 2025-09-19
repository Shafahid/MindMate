from fastapi import APIRouter, HTTPException, status
from app.models.models import CommentRequest
from app.services.moderation_service import moderate_text
import uuid

router = APIRouter()

@router.post("/comment", response_model=dict)
async def submit_comment(payload: CommentRequest):
    content = payload.content
    user_id = payload.user_id
    post_id = payload.post_id

    # Validate empty content
    if not content or not content.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "Comment cannot be empty."}
        )

    # Run moderation
    label, score = await moderate_text(content)

    # Always generate comment ID (accepted or rejected, for audit)
    fake_comment_id = str(uuid.uuid4())

    # Reject toxic comments
    if label == "toxic":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "status": "rejected",
                "comment_id": fake_comment_id,
                "reason": "Please change your comment, it doesn’t meet community standards",
                "model_label": label,
                "confidence": score
            }
        )

    # Accept non-toxic comments
    return {
        "status": "accepted",
        "comment_id": fake_comment_id,
        "reason": "Passed moderation",
        "model_label": label,
        "confidence": score
    }
