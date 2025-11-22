"""
GitHub integration routes
"""
from fastapi import APIRouter, Query
from typing import Optional
import httpx
from app.core.config import settings

router = APIRouter(prefix="/github", tags=["github"])

@router.get("/health")
async def github_health():
    """GitHub service health check"""
    return {"status": "github service active"}

@router.get("/good-first-issues")
async def get_good_first_issues(
    language: Optional[str] = Query(None, description="Programming language filter"),
    query: Optional[str] = Query(None, description="Search query"),
    per_page: int = Query(20, description="Number of issues per page")
):
    """Fetch good first issues from GitHub using authenticated API"""
    try:
        # Build search query
        search_parts = ['label:"good first issue"', 'state:open']
        
        if language and language.lower() != 'all':
            if language.lower() == 'documentation':
                search_parts.append('label:documentation')
            else:
                search_parts.append(f'language:{language}')
        
        if query:
            search_parts.append(query)
        
        search_query = ' '.join(search_parts)
        
        # Make authenticated request to GitHub API
        headers = {
            'Authorization': f'Bearer {settings.GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CodeQuest-App'
        }
        
        url = f'https://api.github.com/search/issues'
        params = {
            'q': search_query,
            'per_page': min(per_page, 100),  # GitHub max is 100
            'sort': 'created',
            'order': 'desc'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
        
        # Transform the data for our frontend
        issues = []
        for item in data.get('items', []):
            issue = {
                'id': item['id'],
                'title': item['title'],
                'repo': item['repository_url'].split('/')[-2:] if item.get('repository_url') else [],
                'repo_name': '/'.join(item['repository_url'].split('/')[-2:]) if item.get('repository_url') else 'unknown/repo',
                'url': item['html_url'],
                'labels': [label['name'] for label in item.get('labels', [])],
                'author': {
                    'login': item['user']['login'],
                    'avatar_url': item['user']['avatar_url']
                },
                'comments': item['comments'],
                'created_at': item['created_at'],
                'body': item.get('body', ''),
                'state': item['state']
            }
            issues.append(issue)
        
        return {
            'issues': issues,
            'total_count': data.get('total_count', 0),
            'query': search_query
        }
        
    except httpx.HTTPStatusError as e:
        print(f"❌ GitHub API error: {e.response.status_code} - {e.response.text}")
        return {
            'error': f'GitHub API error: {e.response.status_code}',
            'issues': [],
            'total_count': 0
        }
    except Exception as e:
        print(f"❌ Error fetching issues: {e}")
        return {
            'error': str(e),
            'issues': [],
            'total_count': 0
        }
