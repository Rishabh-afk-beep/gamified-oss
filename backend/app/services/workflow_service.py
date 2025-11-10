"""
Workflow Service
Manages the complete user journey through the platform
"""

from datetime import datetime

class WorkflowService:
    """Manage user workflow through quests and tasks"""
    
    # Workflow states
    WORKFLOW_STATES = {
        "onboarding": "user_new",
        "quest_selection": "selecting_quest",
        "quest_started": "in_quest",
        "task_execution": "writing_code",
        "need_help": "asked_for_help",
        "code_review": "submitted_for_review",
        "contribution_ready": "ready_to_contribute",
        "contributing": "making_contribution",
        "completed": "workflow_complete"
    }
    
    async def get_user_workflow_state(self, db, user_id: str) -> dict:
        """Get user's current workflow state"""
        try:
            # Get user
            user = await db["users"].find_one({"_id": user_id})
            if not user:
                return {
                    "success": False,
                    "error": "User not found"
                }
            
            # Get current quest
            quest_progress = await db["user_quest_progress"].find_one(
                {
                    "user_id": user_id,
                    "status": "in_progress"
                }
            )
            
            # Get current task
            current_task = None
            if quest_progress:
                for task_id, task_data in quest_progress.get("task_progress", {}).items():
                    if task_data.get("status") == "in_progress":
                        current_task = {
                            "task_id": task_id,
                            "status": task_data.get("status")
                        }
                        break
            
            # Get recent submissions
            recent_submission = await db["code_submissions"].find_one(
                {"user_id": user_id},
                sort=[("timestamp", -1)]
            )
            
            # Determine current state
            if quest_progress:
                if current_task:
                    current_state = "task_execution"
                else:
                    current_state = "quest_selection"
            else:
                current_state = "quest_selection"
            
            return {
                "success": True,
                "state": current_state,
                "user": {
                    "total_xp": user.get("total_xp", 0),
                    "level": (user.get("total_xp", 0) // 1000) + 1
                },
                "quest_progress": quest_progress,
                "current_task": current_task,
                "recent_submission": recent_submission
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def start_workflow(self, db, user_id: str) -> dict:
        """Initialize user workflow"""
        try:
            # Check if workflow exists
            workflow = await db["user_workflows"].find_one(
                {"user_id": user_id}
            )
            
            if workflow:
                return {
                    "success": True,
                    "message": "Workflow already started",
                    "workflow": workflow
                }
            
            # Create new workflow
            new_workflow = {
                "user_id": user_id,
                "started_at": datetime.utcnow(),
                "current_state": "onboarding",
                "quest_count": 0,
                "tasks_completed": 0,
                "submissions_count": 0,
                "ai_help_requests": 0,
                "contributions_made": 0
            }
            
            result = await db["user_workflows"].insert_one(new_workflow)
            
            return {
                "success": True,
                "workflow_id": str(result.inserted_id),
                "message": "Workflow initialized"
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def update_workflow_state(
        self,
        db,
        user_id: str,
        new_state: str,
        metadata: dict = None
    ) -> dict:
        """Update user's workflow state"""
        try:
            update_data = {
                "current_state": new_state,
                "last_updated": datetime.utcnow()
            }
            
            if metadata:
                update_data.update(metadata)
            
            result = await db["user_workflows"].update_one(
                {"user_id": user_id},
                {"$set": update_data}
            )
            
            return {
                "success": True,
                "message": f"State updated to {new_state}",
                "modified": result.modified_count
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def record_ai_help_request(self, db, user_id: str, task_id: str) -> dict:
        """Record when user asks for AI help"""
        try:
            help_record = {
                "user_id": user_id,
                "task_id": task_id,
                "requested_at": datetime.utcnow(),
                "type": "ai_assistance"
            }
            
            result = await db["ai_help_requests"].insert_one(help_record)
            
            # Update workflow
            await db["user_workflows"].update_one(
                {"user_id": user_id},
                {"$inc": {"ai_help_requests": 1}}
            )
            
            return {
                "success": True,
                "help_id": str(result.inserted_id),
                "message": "Help request recorded"
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def record_code_submission(
        self,
        db,
        user_id: str,
        task_id: str,
        code: str,
        status: str = "pending_review"
    ) -> dict:
        """Record code submission"""
        try:
            submission = {
                "user_id": user_id,
                "task_id": task_id,
                "code": code,
                "status": status,
                "submitted_at": datetime.utcnow(),
                "ai_feedback": None,
                "human_feedback": None,
                "revision_count": 0
            }
            
            result = await db["code_submissions"].insert_one(submission)
            
            # Update workflow
            await db["user_workflows"].update_one(
                {"user_id": user_id},
                {"$inc": {"submissions_count": 1}}
            )
            
            return {
                "success": True,
                "submission_id": str(result.inserted_id),
                "message": "Code submitted for review"
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_workflow_analytics(self, db, user_id: str) -> dict:
        """Get user's workflow analytics"""
        try:
            workflow = await db["user_workflows"].find_one(
                {"user_id": user_id}
            )
            
            if not workflow:
                return {
                    "success": False,
                    "error": "No workflow found"
                }
            
            # Count submissions
            submissions = await db["code_submissions"].count_documents(
                {"user_id": user_id}
            )
            
            # Count AI help requests
            help_requests = await db["ai_help_requests"].count_documents(
                {"user_id": user_id}
            )
            
            # Count completed tasks
            tasks_completed = await db["user_quest_progress"].count_documents(
                {
                    "user_id": user_id,
                    "status": "completed"
                }
            )
            
            return {
                "success": True,
                "analytics": {
                    "total_submissions": submissions,
                    "ai_help_requests": help_requests,
                    "tasks_completed": tasks_completed,
                    "current_state": workflow.get("current_state"),
                    "started_at": workflow.get("started_at"),
                    "contributions": workflow.get("contributions_made", 0)
                }
            }
        
        except Exception as e:
            return {"success": False, "error": str(e)}
