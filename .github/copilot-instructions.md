# CodeQuest - Gamified Open Source Learning Platform

## Architecture Overview

This is a full-stack gamified platform helping users learn GitHub/open-source contribution through **quests**, **XP**, **levels**, and **badges**. The workflow follows: onboarding → tutorial quests → GitHub integration → real issue solving → AI code review.

### Core Components
- **Backend**: FastAPI with MongoDB, services pattern (`app/services/`)
- **Frontend**: React + Vite, component-based architecture (`src/components/`)
- **AI**: Google Gemini integration for chat support and code review
- **Authentication**: Dual system - Firebase (frontend) + JWT (backend)
- **Gamification**: XP/level system, badge rewards, streak tracking
- **GitHub Integration**: Issue pulling, contribution tracking via GitHub API

## Development Patterns

### Backend Service Architecture
```python
# Follow this pattern for all services in app/services/
class ExampleService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db["collection_name"]
    
    async def action_name(self, params) -> dict:
        # Service logic here
        return convert_objectid(result)
```

**Critical patterns:**
- Services are initialized with database instance, NOT dependency-injected per request
- All MongoDB operations use `convert_objectid()` from `app.utils.json_encoder`
- Use `AsyncIOMotorDatabase` type hints for database parameters
- Collections accessed as `self.db["collection_name"]`, not separate attributes

### Frontend Component Structure
- **Pages**: Route components in `src/pages/`
- **Components**: Reusable UI in `src/components/` (organized by feature)
- **Services**: API calls in `src/services/` using axios interceptors
- **Context**: Global state (AuthContext, ThemeContext)
- **App Structure**: `App.jsx` is minimal wrapper, `AppLayout.jsx` handles routing/layout

### Database & Models
- MongoDB with Motor (async) - collections: users, quests, tasks, badges, submissions, analytics
- Models use Pydantic with ObjectId handling via `convert_objectid()`
- **Always** use `convert_objectid()` when returning MongoDB documents from services
- ObjectId fields stored as strings in API responses

## Key Workflows

### Development Server Commands
```bash
# Backend (from /backend)
python -m uvicorn app.main:app --reload --port 8000

# Frontend (from /frontend) 
npm run dev

# Backend testing
python test_backend_complete.py  # Integration tests
python final_test.py            # AI system tests
```

### AI Integration (Gemini)
- **Model**: `gemini-2.5-flash-lite` (with fallback model chain in `ai_service.py`)
- **API Key**: Must be set in `.env.local` as `GEMINI_API_KEY`
- **Service Location**: `app/services/ai_service.py` with extensive error handling
- **Endpoints**: `/api/v1/ai/chat`, `/api/v1/ai/explain-code`, `/api/v1/ai/hint`
- **Pattern**: Service validates API key on init, graceful degradation if unavailable

### Firebase + JWT Authentication
```python
# Dual authentication system:
# 1. Frontend uses Firebase Auth (email/password, OAuth)
# 2. Backend verifies Firebase tokens OR issues JWT tokens
# 3. Service account setup required for backend token verification
```

**Setup Requirements:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_SERVICE_ACCOUNT_PATH` environment variables
- See `FIREBASE_SETUP.md` for complete configuration steps

### Quest System Architecture
- Quest models in `models/quest.py`, services in `services/quest_service.py`
- XP calculation: beginner(50), intermediate(100), advanced(200)
- Level calculation: every 1000 XP = 1 level
- User progress tracked in `user_quests` collection

## API Architecture

### Router Pattern
```python
# All routers in app/api/v1/ follow this pattern:
from fastapi import APIRouter, Depends
from app.core.database import get_db

router = APIRouter(prefix="/endpoint", tags=["endpoint"])

@router.post("/action")
async def action(data: RequestModel, db = Depends(get_db)):
    service = ServiceClass(db)
    return await service.action_method(data)
```

### Configuration System
- Settings class in `app/core/config.py` uses `pydantic-settings`
- Environment loaded from `.env.local` file
- **Critical**: `validate_settings()` function runs on import - check console output
- Multiple API integrations configured: GitHub, Firebase, Gemini

## Testing & Debugging

### Testing Files
- `test_backend_complete.py`: Live API integration tests (requires running server)
- `final_test.py`: AI system validation
- `tests/`: Unit test suite using pytest
- Frontend: Jest + React Testing Library

### Development Scripts
- `complete_setup.py`: Validates AI integration setup
- `create_missing_routes.py`: Scaffolds missing API routes
- `detect_models.py`: Analyzes model dependencies

### Common Issues
- **Gemini API failures**: Check `GEMINI_API_KEY` in logs, service has fallback models
- **MongoDB ObjectId errors**: Always use `convert_objectid()` from services
- **Firebase auth**: Requires service account setup for backend verification

## Environment Setup

### Required Environment Variables (.env.local)
```bash
# AI Integration
GEMINI_API_KEY="your_gemini_api_key"

# Database
MONGODB_URL="mongodb://localhost:27017/codequest"

# Authentication
SECRET_KEY="your-secret-key"
FIREBASE_SERVICE_ACCOUNT_KEY="firebase_service_account_json"

# GitHub Integration
GITHUB_TOKEN="github_personal_access_token"
GITHUB_CLIENT_ID="github_oauth_client_id"
GITHUB_CLIENT_SECRET="github_oauth_secret"
```

## Critical Dependencies
- **Backend**: FastAPI, Motor (MongoDB async), Google GenerativeAI, Firebase Admin SDK
- **Frontend**: React 18, React Router v6, Axios, Firebase SDK, Monaco Editor
- **AI**: `google-generativeai` package with model fallback chain
- **Auth**: Firebase Auth + JWT hybrid system

## Integration Points
- **GitHub API**: OAuth + issue tracking via PyGithub
- **Firebase**: User auth + real-time features
- **Gemini AI**: Code review, hints, educational chat
- **MongoDB**: All persistent data with async Motor driver

Remember: This platform teaches through guided practice, not tutorials. Focus on actionable quests that build real skills progressively.