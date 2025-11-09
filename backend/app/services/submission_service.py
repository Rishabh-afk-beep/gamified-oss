from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

class SubmissionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.submissions_collection = db["submissions"]
        self.users_collection = db["users"]
        self.tasks_collection = db["tasks"]

    async def create_submission(self, user_id: str, task_id: str, code: str, language: str) -> dict:
        """Create code submission"""
        try:
            submission = {
                "user_id": user_id,
                "task_id": task_id,
                "code": code,
                "language": language,
                "status": "pending",
                "test_results": None,
                "feedback": None,
                "xp_awarded": 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
            
            result = await self.submissions_collection.insert_one(submission)
            return {"submission_id": str(result.inserted_id), "status": "pending"}
        except Exception as e:
            raise ValueError(f"Error creating submission: {str(e)}")

    async def get_submission(self, submission_id: str) -> dict:
        """Get submission details"""
        try:
            submission = await self.submissions_collection.find_one({
                "_id": ObjectId(submission_id)
            })
            
            if not submission:
                raise ValueError("Submission not found")
            
            return self._format_submission(submission)
        except Exception as e:
            raise ValueError(f"Error fetching submission: {str(e)}")

    async def get_user_submissions(self, user_id: str, task_id: str = None, limit: int = 50) -> list:
        """Get user's submissions"""
        try:
            query = {"user_id": user_id}
            if task_id:
                query["task_id"] = task_id
            
            submissions = await self.submissions_collection.find(query).sort(
                "created_at", -1
            ).limit(limit).to_list(limit)
            
            return [self._format_submission(s) for s in submissions]
        except Exception as e:
            raise ValueError(f"Error fetching submissions: {str(e)}")

    async def evaluate_submission(self, submission_id: str) -> dict:
        """Evaluate submission and run tests"""
        try:
            submission = await self.submissions_collection.find_one({
                "_id": ObjectId(submission_id)
            })
            
            if not submission:
                raise ValueError("Submission not found")
            
            # Run code validation (mock for now)
            test_results = self._run_tests(submission["code"], submission["language"])
            
            status = "passed" if test_results.get("all_passed") else "failed"
            xp_awarded = 50 if status == "passed" else 0
            
            # Update submission
            await self.submissions_collection.update_one(
                {"_id": ObjectId(submission_id)},
                {"$set": {
                    "status": status,
                    "test_results": test_results,
                    "xp_awarded": xp_awarded,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            # Award XP if passed
            if status == "passed" and xp_awarded > 0:
                await self.users_collection.update_one(
                    {"_id": ObjectId(submission["user_id"])},
                    {"$inc": {"total_xp": xp_awarded}}
                )
            
            return {
                "status": status,
                "test_results": test_results,
                "xp_awarded": xp_awarded
            }
        except Exception as e:
            raise ValueError(f"Error evaluating submission: {str(e)}")

    def _run_tests(self, code: str, language: str) -> dict:
        """Run tests on code (mock implementation)"""
        # Mock test results
        return {
            "total_tests": 5,
            "passed": 5,
            "failed": 0,
            "all_passed": True,
            "test_cases": [
                {"name": "Test 1", "status": "passed"},
                {"name": "Test 2", "status": "passed"},
                {"name": "Test 3", "status": "passed"},
                {"name": "Test 4", "status": "passed"},
                {"name": "Test 5", "status": "passed"},
            ]
        }

    def _format_submission(self, submission: dict) -> dict:
        """Format submission response"""
        return {
            "id": str(submission.get("_id")),
            "user_id": submission.get("user_id"),
            "task_id": submission.get("task_id"),
            "code": submission.get("code"),
            "language": submission.get("language"),
            "status": submission.get("status"),
            "test_results": submission.get("test_results"),
            "xp_awarded": submission.get("xp_awarded"),
            "created_at": submission.get("created_at"),
        }
