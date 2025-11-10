"""
Workflow API Endpoints
"""

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.workflow_service import WorkflowService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/workflow", tags=["workflow"])
workflow_service = WorkflowService()

class UpdateWorkflowStateRequest(BaseModel):
    """Update workflow state"""
    new_state: str
    user_id: str = "demo_user"
    metadata: dict = {}

class SubmitCodeForReviewRequest(BaseModel):
    """Submit code for AI review"""
    task_id: str
    code: str
    user_id: str = "demo_user"

class AskAIHelpRequest(BaseModel):
    """Request AI help"""
    task_id: str
    question: str
    user_id: str = "demo_user"

# ==================== STATE ENDPOINTS ====================

@router.get("/{user_id}/state")
async def get_workflow_state(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's current workflow state"""
    try:
        result = await workflow_service.get_user_workflow_state(db, user_id)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/init")
async def initialize_workflow(
    user_id: str = "demo_user",
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Initialize user workflow"""
    try:
        result = await workflow_service.start_workflow(db, user_id)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/update-state")
async def update_workflow_state(
    req: UpdateWorkflowStateRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update workflow state"""
    try:
        result = await workflow_service.update_workflow_state(
            db,
            req.user_id,
            req.new_state,
            req.metadata
        )
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

# ==================== TASK EXECUTION ENDPOINTS ====================

@router.post("/ask-ai-help")
async def ask_ai_help(
    req: AskAIHelpRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Request AI help during task"""
    try:
        # Record the help request
        result = await workflow_service.record_ai_help_request(
            db,
            req.user_id,
            req.task_id
        )
        
        if result.get("success"):
            # Get AI response (using existing AI service)
            from app.services.ai_service import AIService
            ai_service = AIService()
            
            ai_response = await ai_service.chat(
                req.question,
                req.user_id,
                f"Helping with task: {req.task_id}"
            )
            
            return {
                "success": True,
                "help_id": result["help_id"],
                "ai_response": ai_response.get("response"),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        return result
    
    except Exception as e:
        return {"success": False, "error": str(e)}

# ==================== CODE REVIEW ENDPOINTS ====================

@router.post("/submit-for-review")
async def submit_code_for_review(
    req: SubmitCodeForReviewRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit code for AI review"""
    try:
        # Record submission
        result = await workflow_service.record_code_submission(
            db,
            req.user_id,
            req.task_id,
            req.code,
            "pending_review"
        )
        
        if result.get("success"):
            # Get AI feedback
            from app.services.ai_service import AIService
            ai_service = AIService()
            
            feedback_prompt = f"""
Review this code and provide constructive feedback:

Code:
{req.code}

Please provide:
1. What the code does well
2. Areas for improvement
3. Best practices suggestions
4. Any bugs or issues
5. Rating (1-5 stars)
            """
            
            ai_response = await ai_service.chat(
                feedback_prompt,
                req.user_id,
                f"Code review for task: {req.task_id}"
            )
            
            # Save feedback to database
            await db["code_submissions"].update_one(
                {"_id": result["submission_id"]},
                {
                    "$set": {
                        "ai_feedback": ai_response.get("response"),
                        "status": "reviewed"
                    }
                }
            )
            
            return {
                "success": True,
                "submission_id": result["submission_id"],
                "feedback": ai_response.get("response"),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        return result
    
    except Exception as e:
        return {"success": False, "error": str(e)}

# ==================== ANALYTICS ENDPOINTS ====================

@router.get("/{user_id}/analytics")
async def get_workflow_analytics(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's workflow analytics"""
    try:
        result = await workflow_service.get_workflow_analytics(db, user_id)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/{user_id}/progress")
async def get_workflow_progress(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get overall workflow progress"""
    try:
        # Get all progress
        workflow_state = await workflow_service.get_user_workflow_state(db, user_id)
        analytics = await workflow_service.get_workflow_analytics(db, user_id)
        
        return {
            "success": True,
            "state": workflow_state.get("state"),
            "analytics": analytics.get("analytics")
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
