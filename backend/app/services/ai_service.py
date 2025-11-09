from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import os

class AIService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.chat_history_collection = db["chat_history"]
        self.code_reviews_collection = db["code_reviews"]
        self.tasks_collection = db["tasks"]

    async def chat(self, user_id: str, message: str, context: dict = None) -> dict:
        """Process chat message with AI"""
        try:
            # Store chat message
            chat_entry = {
                "user_id": user_id,
                "role": "user",
                "content": message,
                "context": context,
                "created_at": datetime.utcnow(),
            }
            
            await self.chat_history_collection.insert_one(chat_entry)
            
            # For now, return mock AI response
            # In production, integrate with OpenAI API
            ai_response = self._generate_response(message, context)
            
            # Store AI response
            response_entry = {
                "user_id": user_id,
                "role": "assistant",
                "content": ai_response,
                "created_at": datetime.utcnow(),
            }
            
            await self.chat_history_collection.insert_one(response_entry)
            
            return {
                "message": ai_response,
                "suggestions": self._get_suggestions(message),
                "timestamp": datetime.utcnow()
            }
        except Exception as e:
            raise ValueError(f"Error in chat: {str(e)}")

    async def review_code(self, user_id: str, code: str, language: str, context: dict = None) -> dict:
        """Review code with AI"""
        try:
            # Store code review
            review = {
                "user_id": user_id,
                "code": code,
                "language": language,
                "context": context,
                "created_at": datetime.utcnow(),
            }
            
            result = await self.code_reviews_collection.insert_one(review)
            
            # Generate code review feedback
            feedback = self._analyze_code(code, language)
            
            # Update review with feedback
            await self.code_reviews_collection.update_one(
                {"_id": result.inserted_id},
                {"$set": {"feedback": feedback, "reviewed_at": datetime.utcnow()}}
            )
            
            return feedback
        except Exception as e:
            raise ValueError(f"Error reviewing code: {str(e)}")

    async def get_hint(self, user_id: str, task_id: str) -> dict:
        """Get hint for task"""
        try:
            task = await self.tasks_collection.find_one({"_id": ObjectId(task_id)})
            if not task:
                raise ValueError("Task not found")
            
            hints = task.get("hints", [])
            if not hints:
                return {"hint": "Think about breaking down the problem into smaller parts"}
            
            return {"hint": hints[0]}
        except Exception as e:
            raise ValueError(f"Error getting hint: {str(e)}")

    async def get_chat_history(self, user_id: str, limit: int = 50) -> list:
        """Get chat history for user"""
        try:
            messages = await self.chat_history_collection.find({
                "user_id": user_id
            }).sort("created_at", -1).limit(limit).to_list(limit)
            
            return [self._format_message(msg) for msg in messages]
        except Exception as e:
            raise ValueError(f"Error fetching chat history: {str(e)}")

    def _generate_response(self, message: str, context: dict = None) -> str:
        """Generate AI response (mock for now)"""
        # Simple keyword matching for mock responses
        if "hello" in message.lower():
            return "Hi! I'm your CodeQuest AI assistant. How can I help you with coding?"
        elif "how" in message.lower():
            return "I can help you with coding concepts, debugging, and learning. What would you like to know?"
        elif "help" in message.lower():
            return "I'm here to help! You can ask me about coding concepts, get code reviews, or ask for hints on tasks."
        else:
            return f"Thanks for asking about '{message}'. In production, I'll provide AI-powered responses using OpenAI's API."

    def _get_suggestions(self, message: str) -> list:
        """Get follow-up suggestions"""
        return [
            "Can you explain this concept?",
            "Show me an example",
            "What's the best practice?"
        ]

    def _analyze_code(self, code: str, language: str) -> dict:
        """Analyze code for review (mock for now)"""
        lines = code.split('\n')
        
        correct = [
            "Code structure is clean",
            "Good variable naming"
        ]
        
        warnings = []
        improvements = []
        
        # Simple heuristic checks
        if len(lines) < 3:
            warnings.append("Code is very short - make sure it solves the problem")
        
        if "TODO" in code or "FIXME" in code:
            warnings.append("Found TODO/FIXME comments")
        
        if "print" in code:
            improvements.append("Consider using logging instead of print statements")
        
        if language == "python" and "import *" in code:
            warnings.append("Avoid 'import *' statements")
        
        return {
            "correct": correct,
            "warnings": warnings,
            "improvements": improvements,
            "score": 75
        }

    def _format_message(self, message: dict) -> dict:
        """Format message response"""
        return {
            "role": message.get("role"),
            "content": message.get("content"),
            "timestamp": message.get("created_at")
        }
