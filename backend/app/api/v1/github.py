from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.github_service import GitHubService
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from app.core.config import settings

router = APIRouter(prefix="/github", tags=["github"])
github_service = GitHubService()

# Get GitHub token from environment
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") or settings.GITHUB_TOKEN

class GitHubRequest(BaseModel):
    github_username: str
    repo_name: str

@router.post("/profile")
async def github_profile(req: GitHubRequest):
    result = await github_service.get_user_profile(req.github_username)
    return result

@router.post("/track_commits")
async def github_commits(req: GitHubRequest):
    result = await github_service.count_recent_commits(req.github_username, req.repo_name)
    return result

@router.post("/track_prs")
async def github_prs(req: GitHubRequest):
    result = await github_service.count_pull_requests(req.github_username, req.repo_name)
    return result

@router.get("/search/issues")
async def search_github_issues(
    q: str = Query(..., description="GitHub search query"),
    per_page: int = Query(20, le=100),
    page: int = Query(1),
    sort: Optional[str] = Query(None, regex="^(comments|created|updated)$"),
    order: Optional[str] = Query("desc", regex="^(asc|desc)$")
):
    """
    Proxy GitHub issues search API
    
    Example queries:
    - q="label:good-first-issue state:open"
    - q="label:good-first-issue language:javascript state:open"  
    - q="label:documentation state:open"
    """
    try:
        # Build GitHub API URL
        url = "https://api.github.com/search/issues"
        params = {
            "q": q,
            "per_page": per_page,
            "page": page
        }
        if sort:
            params["sort"] = sort
            params["order"] = order
        
        # Set headers
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeQuest-App"
        }
        
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
            print(f"🔑 Using GitHub token for API call")
        else:
            print(f"⚠️ No GitHub token - using unauthenticated API (60 req/hour limit)")
        
        # Make request to GitHub API
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
            
            if response.status_code == 403:
                # Check if it's rate limiting
                if "rate limit" in response.text.lower():
                    raise HTTPException(
                        status_code=429, 
                        detail="GitHub API rate limit exceeded. Add GITHUB_TOKEN to environment for higher limits."
                    )
                else:
                    raise HTTPException(status_code=403, detail="GitHub API access forbidden")
            
            response.raise_for_status()
            
            data = response.json()
            
            # Transform the response to a cleaner format
            transformed_items = []
            for item in data.get("items", []):
                # Extract repository name from html_url
                repo_name = "/".join(item["html_url"].split("/")[3:5]) if item.get("html_url") else "unknown/repo"
                
                transformed_item = {
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "repo": repo_name,
                    "url": item.get("html_url"),
                    "labels": [label.get("name", label) if isinstance(label, dict) else label 
                             for label in item.get("labels", [])],
                    "author": {
                        "login": item.get("user", {}).get("login"),
                        "avatar_url": item.get("user", {}).get("avatar_url")
                    },
                    "comments": item.get("comments", 0),
                    "created_at": item.get("created_at"),
                    "updated_at": item.get("updated_at"),
                    "body": item.get("body", "")[:200] + "..." if len(item.get("body", "")) > 200 else item.get("body", "")
                }
                transformed_items.append(transformed_item)
            
            return {
                "total_count": data.get("total_count", 0),
                "incomplete_results": data.get("incomplete_results", False),
                "items": transformed_items,
                "rate_limit_remaining": response.headers.get("x-ratelimit-remaining"),
                "rate_limit_reset": response.headers.get("x-ratelimit-reset")
            }
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"GitHub API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitHub issues: {str(e)}")

@router.get("/rate-limit")
async def get_github_rate_limit():
    """Check current GitHub API rate limit status"""
    try:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeQuest-App"
        }
        
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.github.com/rate_limit", headers=headers)
            response.raise_for_status()
            
            return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking rate limit: {str(e)}")
