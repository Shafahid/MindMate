# MindMate Backend

## Features
- FastAPI backend for mental health companion
- SQLModel ORM for Supabase/PostgreSQL
- Hugging Face Inference API for moderation & mood analysis
- Modular, maintainable structure
- Dockerized for hackathon/demo

## Project Structure
```
app/
 ├── main.py
 ├── models.py
 ├── db.py
 ├── api/
 │    ├── routes_peer.py
 │    ├── routes_mood.py
 │    ├── routes_moderation.py
 ├── core/
 │    ├── config.py
 │    ├── cache.py
 │    ├── logging.py
 └── services/
      ├── moderation_service.py
      ├── mood_service.py
alembic/
 ├── versions/
 └── env.py
alembic.ini
requirements.txt
Dockerfile
docker-compose.yml
README.md
.env.example
```

## Setup
1. Copy `.env.example` to `.env` and fill in your secrets.
2. Build and run with Docker Compose:
   ```powershell
   docker-compose up --build
   ```
3. API available at `http://localhost:8000`

## Endpoints
- `POST /peer` — submit anonymous post (moderated)
- `POST /mood` — submit mood (emoji/text/slider)
- `GET /mood/history` — get weekly/monthly mood history
- `GET /moderation/logs/{post_id}` — moderation transparency



## Notes
- Hugging Face API key required for moderation/sentiment
- Supabase/PostgreSQL required for DB
