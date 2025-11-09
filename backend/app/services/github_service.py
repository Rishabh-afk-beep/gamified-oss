from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
import requests
from app.core.config import settings

class GitHubService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]
        self.github_contributions_collection = db["github_contributions"]
        self.github_api_base = "https://api.github.com"

    async def authenticate_with_github(self, code: str, user_id: str) -> dict:
        """Authenticate user with GitHub OAuth"""
        try:
            # Exchange code for access token
            token_url = "https://github.com/login/oauth/access_token"
            headers = {"Accept": "application/json"}
            data = {
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            }
            
            response = requests.post(token_url, headers=headers, data=data)
            token_data = response.json()
            
            if "error" in token_data:
                raise ValueError("Failed to get access token from GitHub")
            
            access_token = token_data.get("access_token")
            
            # Get user info from GitHub
            user_info = await self._get_github_user_info(access_token)
            
            # Update user with GitHub info
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "github_id": user_info["id"],
                    "github_username": user_info["login"],
                    "github_access_token": access_token,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return {
                "authenticated": True,
                "github_username": user_info["login"]
            }
        except Exception as e:
            raise ValueError(f"GitHub authentication failed: {str(e)}")

    async def _get_github_user_info(self, access_token: str) -> dict:
        """Get user info from GitHub API"""
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        response = requests.get(f"{self.github_api_base}/user", headers=headers)
        
        if response.status_code != 200:
            raise ValueError("Failed to fetch GitHub user info")
        
        return response.json()

    async def get_user_repositories(self, github_username: str, access_token: str = None) -> list:
        """Get user's repositories from GitHub"""
        try:
            headers = {"Accept": "application/vnd.github.v3+json"}
            
            if access_token:
                headers["Authorization"] = f"Bearer {access_token}"
            
            response = requests.get(
                f"{self.github_api_base}/users/{github_username}/repos",
                headers=headers
            )
            
            if response.status_code != 200:
                return []
            
            repos = response.json()
            return [self._format_repo(repo) for repo in repos]
        except Exception as e:
            raise ValueError(f"Error fetching repositories: {str(e)}")

    async def get_repository_issues(self, owner: str, repo: str) -> list:
        """Get issues from repository"""
        try:
            headers = {"Accept": "application/vnd.github.v3+json"}
            
            response = requests.get(
                f"{self.github_api_base}/repos/{owner}/{repo}/issues",
                headers=headers
            )
            
            if response.status_code != 200:
                return []
            
            issues = response.json()
            return [self._format_issue(issue) for issue in issues]
        except Exception as e:
            raise ValueError(f"Error fetching issues: {str(e)}")

    async def get_pull_requests(self, owner: str, repo: str) -> list:
        """Get pull requests from repository"""
        try:
            headers = {"Accept": "application/vnd.github.v3+json"}
            
            response = requests.get(
                f"{self.github_api_base}/repos/{owner}/{repo}/pulls",
                headers=headers
            )
            
            if response.status_code != 200:
                return []
            
            prs = response.json()
            return [self._format_pr(pr) for pr in prs]
        except Exception as e:
            raise ValueError(f"Error fetching pull requests: {str(e)}")

    async def track_contribution(self, user_id: str, contribution_data: dict) -> dict:
        """Track user's GitHub contribution"""
        try:
            contribution = {
                "user_id": user_id,
                "type": contribution_data.get("type"),  # "pull_request", "issue", "commit"
                "repository": contribution_data.get("repository"),
                "url": contribution_data.get("url"),
                "xp_earned": contribution_data.get("xp_earned", 50),
                "created_at": datetime.utcnow(),
            }
            
            result = await self.github_contributions_collection.insert_one(contribution)
            
            # Award XP to user
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"total_xp": contribution["xp_earned"]}}
            )
            
            return {"contribution_tracked": True, "xp_earned": contribution["xp_earned"]}
        except Exception as e:
            raise ValueError(f"Error tracking contribution: {str(e)}")

    def _format_repo(self, repo: dict) -> dict:
        """Format repository response"""
        return {
            "id": repo.get("id"),
            "name": repo.get("name"),
            "url": repo.get("html_url"),
            "description": repo.get("description"),
            "stars": repo.get("stargazers_count"),
            "language": repo.get("language"),
        }

    def _format_issue(self, issue: dict) -> dict:
        """Format issue response"""
        return {
            "id": issue.get("id"),
            "number": issue.get("number"),
            "title": issue.get("title"),
            "url": issue.get("html_url"),
            "state": issue.get("state"),
        }

    def _format_pr(self, pr: dict) -> dict:
        """Format pull request response"""
        return {
            "id": pr.get("id"),
            "number": pr.get("number"),
            "title": pr.get("title"),
            "url": pr.get("html_url"),
            "state": pr.get("state"),
        }
