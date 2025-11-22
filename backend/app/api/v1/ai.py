"""
AI Chat API Endpoints
Routes for AI interactions, code explanations, hints, etc.
"""

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.ai_service import AIService
from pydantic import BaseModel
from datetime import datetime

# Create router
router = APIRouter(prefix="/ai", tags=["ai"])

# Initialize AI service
ai_service = AIService()

# ==================== PYDANTIC MODELS ====================

class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    message: str
    context: str = ""
    user_id: str = "demo_user"

class ExplainCodeRequest(BaseModel):
    """Request to explain code"""
    code: str
    language: str = "python"

class HintRequest(BaseModel):
    """Request for a hint"""
    problem_title: str
    problem_description: str
    difficulty: str = "beginner"

class DebugRequest(BaseModel):
    """Request for debugging help"""
    code: str
    error: str
    language: str = "python"

class LearnRequest(BaseModel):
    """Request to learn a concept"""
    concept: str
    level: str = "beginner"

class CodeReviewRequest(BaseModel):
    """Request for AI code review"""
    code: str
    language: str = "python"
    quest_context: dict = None

class QuestHintRequest(BaseModel):
    """Request for quest-specific hint"""
    quest_id: str
    quest_context: dict
    user_attempt: str = None

# ==================== ENDPOINTS ====================

@router.post("/chat")
async def ai_chat(request: ChatRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Chat with AI assistant using Google Gemini
    """
    try:
        print(f"🤖 Processing chat request from {request.user_id}: {request.message[:50]}...")
        
        # Validate request
        if not request.message or not request.message.strip():
            return {
                "success": False,
                "response": "Please provide a message to chat with the AI.",
                "error": "Empty message"
            }
        
        # Get AI response
        result = await ai_service.chat(
            request.message,
            request.user_id,
            request.context
        )
        
        # Ensure result has required fields
        if not result:
            return {
                "success": False,
                "response": "AI service returned no response. Please try again.",
                "error": "Null result from AI service"
            }
        
        # Check for successful response
        if result.get("success") and result.get("response"):
            # Save to database if successful
            try:
                await db["ai_chats"].insert_one({
                    "user_id": request.user_id,
                    "message": request.message,
                    "response": result["response"],
                    "context": request.context,
                    "tokens_used": result.get("tokens_used", 0),
                    "model": result.get("model", "unknown"),
                    "timestamp": datetime.utcnow()
                })
                print(f"✅ Chat saved to database")
            except Exception as db_error:
                print(f"⚠️  Database save failed: {db_error}")
                # Don't fail the request if database save fails
            
            return {
                "success": True,
                "response": result["response"],
                "timestamp": result.get("timestamp"),
                "tokens_used": result.get("tokens_used"),
                "model": result.get("model")
            }
        else:
            # AI service failed
            error_message = result.get("error", "AI service failed")
            ai_response = result.get("response", "I'm having trouble processing your request. Please try again.")
            
            return {
                "success": False,
                "response": ai_response,
                "error": error_message
            }
    
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error in chat endpoint: {error_msg}")
        
        return {
            "success": False,
            "response": "I'm experiencing technical difficulties. Please try again in a moment.",
            "error": error_msg
        }


@router.post("/explain-code")
async def explain_code(request: ExplainCodeRequest):
    """
    Get explanation for a code snippet
    
    Parameters:
    - code: The code to explain
    - language: Programming language (python, javascript, java, etc.)
    
    Example:
    {
        "code": "def factorial(n):\\n    return 1 if n <= 1 else n * factorial(n-1)",
        "language": "python"
    }
    """
    try:
        print(f"📝 Explaining {request.language} code")
        
        explanation = await ai_service.get_code_explanation(
            request.code,
            request.language
        )
        
        return {
            "success": True,
            "explanation": explanation,
            "timestamp": datetime.utcnow().isoformat(),
            "language": request.language
        }
    
    except Exception as e:
        print(f"❌ Error explaining code: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/get-hint")
async def get_hint(request: HintRequest):
    """
    Get a helpful hint for a problem
    
    Important: Hints guide learning, they don't give away answers!
    
    Parameters:
    - problem_title: The problem's title
    - problem_description: Full description of the problem
    - difficulty: Difficulty level (beginner/intermediate/advanced)
    
    Example:
    {
        "problem_title": "Find Largest Number",
        "problem_description": "Find the largest number in an array",
        "difficulty": "beginner"
    }
    """
    try:
        print(f"💡 Generating hint for: {request.problem_title}")
        
        hint = await ai_service.generate_hint(
            request.problem_title,
            request.problem_description,
            request.difficulty
        )
        
        return {
            "success": True,
            "hint": hint,
            "problem_title": request.problem_title,
            "difficulty": request.difficulty,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        print(f"❌ Error generating hint: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/debug-code")
async def debug_code(request: DebugRequest):
    """
    Get help debugging code
    
    Parameters:
    - code: The code that has an error
    - error: The error message you received
    - language: Programming language
    
    Example:
    {
        "code": "x = [1, 2, 3]\\nprint(x[10])",
        "error": "IndexError: list index out of range",
        "language": "python"
    }
    """
    try:
        print(f"🐛 Debugging {request.language} code")
        
        advice = await ai_service.debug_code(
            request.code,
            request.error,
            request.language
        )
        
        return {
            "success": True,
            "advice": advice,
            "error": request.error,
            "language": request.language,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        print(f"❌ Error debugging: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/learn-concept")
async def learn_concept(request: LearnRequest):
    """
    Learn a programming concept
    
    Parameters:
    - concept: The concept to learn (e.g., recursion, loops, async/await)
    - level: Learning level (beginner/intermediate/advanced)
    
    Example:
    {
        "concept": "recursion",
        "level": "beginner"
    }
    """
    try:
        print(f"📚 Teaching {request.concept} at {request.level} level")
        
        content = await ai_service.learn_concept(
            request.concept,
            request.level
        )
        
        return {
            "success": True,
            "content": content,
            "concept": request.concept,
            "level": request.level,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        print(f"❌ Error teaching concept: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/clear-history")
async def clear_chat_history():
    """Clear the AI conversation history"""
    try:
        ai_service.clear_history()
        return {
            "success": True,
            "message": "Chat history cleared successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/health")
async def ai_health():
    """Check if AI service is healthy"""
    try:
        return {
            "status": "healthy",
            "service": "AI Assistant (Google Gemini)",
            "model": ai_service.model_name,
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@router.post("/review-code")
async def review_code(request: CodeReviewRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    AI code review for quest submissions
    
    Determines if code is correct and provides feedback
    """
    try:
        print(f"🔍 AI Code Review requested for {request.language} code")
        
        if not request.code or not request.code.strip():
            return {
                "success": False,
                "is_correct": False,
                "feedback": "Please provide code to review.",
                "suggestions": ["Write some code first!", "Make sure your code isn't empty"]
            }
        
        # Get AI review
        review_result = await ai_service.review_code(
            request.code,
            request.language,
            request.quest_context
        )
        
        if review_result["success"]:
            # Save review to database
            try:
                await db["code_reviews"].insert_one({
                    "code": request.code,
                    "language": request.language,
                    "quest_context": request.quest_context,
                    "is_correct": review_result["is_correct"],
                    "score": review_result.get("score", 0),
                    "feedback": review_result["feedback"],
                    "suggestions": review_result["suggestions"],
                    "timestamp": datetime.utcnow()
                })
                print(f"✅ Code review saved to database")
            except Exception as db_error:
                print(f"⚠️  Database save failed: {db_error}")
        
        return review_result
        
    except Exception as e:
        print(f"❌ Error in code review endpoint: {str(e)}")
        return {
            "success": False,
            "is_correct": False,
            "feedback": "Code review service encountered an error. Please try again.",
            "suggestions": ["Try submitting again", "Check if your code is valid"],
            "error": str(e)
        }


@router.post("/quest-hint")
async def get_quest_hint(request: QuestHintRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get AI-generated hint for a specific quest
    """
    try:
        print(f"💡 Quest hint requested for: {request.quest_context.get('title', 'Unknown quest')}")
        
        hint_result = await ai_service.get_hint_for_quest(
            request.quest_context,
            request.user_attempt
        )
        
        if hint_result["success"]:
            # Save hint request to database
            try:
                await db["quest_hints"].insert_one({
                    "quest_id": request.quest_id,
                    "quest_context": request.quest_context,
                    "user_attempt": request.user_attempt,
                    "hint": hint_result["hint"],
                    "timestamp": datetime.utcnow()
                })
            except Exception as db_error:
                print(f"⚠️  Hint save failed: {db_error}")
        
        return hint_result
        
    except Exception as e:
        print(f"❌ Error in quest hint endpoint: {str(e)}")
        return {
            "success": False,
            "hint": "I'm having trouble generating a hint right now. Keep trying! 💪",
            "error": str(e)
        }
