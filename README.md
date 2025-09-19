
# MindMate

MindMate is a full-stack mental health companion platform designed to help users track moods, chat with an AI, connect with a supportive community, and access self-care tools. Built for privacy, safety, and engagement.

---

## Features

- **Mood Tracking**: Log daily moods (positive, neutral, negative) and visualize trends, heatmaps, and statistics.
- **AI Chatbot**: Context-aware chatbot for support, advice, and conversation. Supports text and voice input, with Markdown rendering for AI responses.
- **Voice Messaging**: Record, playback, and send voice messages to the chatbot. Transcription and AI response included.
- **Community Peer Posts**: Share anonymous posts, comment, react, and connect with others. All content is moderated for safety.
- **Comment Moderation**: Comments are checked for safety and community standards before posting.
- **Dashboard Analytics**: View mood stats, motivational quotes, and personalized recommendations based on your data.
- **Self-Help Toolkit**: Breathing exercises, meditation, journaling, and more.
- **Authentication**: Secure signup/signin with Supabase. Only first/last name, email, and password required.
- **Edit/Delete**: Users can edit or delete their own posts/comments.
- **Error Feedback**: Clear error messages for forbidden content or moderation issues.
- **Logout & Profile**: Proper sign out and profile management.

---

## Tech Stack

- **Frontend**: Next.js (React), TypeScript, Recharts, ReactMarkdown, Supabase JS, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Alembic, Supabase/PostgreSQL, Redis (caching), Hugging Face Inference API
- **Database**: Supabase/PostgreSQL
- **Auth**: Supabase Auth
- **Deployment**: Docker, Docker Compose

---

## Data Models

### mood_entries
```sql
create table mood_entries (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references profiles(id) on delete cascade,
	mood_value text not null check (mood_value in ('positive', 'neutral', 'negative')),
	created_at date default current_date
);
```

### profiles
```sql
create table profiles (
	id uuid primary key,
	first_name text,
	last_name text,
	email text unique,
	created_at timestamp default now()
);
```

### user_posts, user_comments, post_reactions
*Standard community tables for posts, comments, and reactions, all linked to profiles and moderated before insert.*

---

## API Endpoints

- `POST /peer` — Submit anonymous post (moderated)
- `POST /mood` — Submit mood (emoji/text/slider)
- `GET /mood/history` — Get weekly/monthly mood history
- `POST /comment` — Submit moderated comment
- `POST /chat` — Send chat messages (context-aware)
- `POST /chat/voice` — Send voice message for transcription and AI response

---

## Setup & Installation

### Backend
1. Copy `.env.example` to `.env` and fill in secrets (Supabase, Hugging Face, Redis).
2. Build and run:
   ```powershell
   docker-compose up --build
   ```
3. API available at `http://localhost:8000`

### Frontend
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. App available at `http://localhost:3000`

---

## Usage

- Sign up or sign in with email and password.
- Log your mood daily and view analytics on the dashboard.
- Chat with the AI via text or voice.
- Post anonymously, comment, and react in the community.
- Use self-help tools for journaling, breathing, and meditation.

---

## Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

---

## License

MIT