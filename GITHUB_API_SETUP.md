# GitHub API Setup for CodeQuest

## Current Setup
The frontend can fetch GitHub issues in two ways:
1. **Backend Proxy** (recommended): Uses server-side token, higher rate limits
2. **Direct API**: Fallback to GitHub API from browser (60 requests/hour)

## Adding GitHub Token (Optional but Recommended)

### Step 1: Generate GitHub Personal Access Token
1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Set expiration (e.g., 90 days or No expiration for development)
4. Select scopes:
   - ✅ `public_repo` (access public repositories)
   - ✅ `read:user` (read user profile)
   - ⚠️ `repo` (if you want access to private repos - optional)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Add Token to Environment
Add to your `.env.local` file in the `/backend` directory:

```bash
# GitHub Integration
GITHUB_TOKEN="ghp_your_token_here_1234567890abcdef"
```

### Step 3: Restart Backend
```bash
# From backend directory
python -m uvicorn app.main:app --reload --port 8000
```

## Rate Limits

| Setup | Rate Limit | Access |
|-------|------------|--------|
| No token | 60 requests/hour | Public repos only |
| Personal token | 5,000 requests/hour | Public + private repos you have access to |
| GitHub App | 5,000 requests/hour per installation | More secure for production |

## API Endpoints Added

### 1. Search Issues
```
GET /api/v1/github/search/issues?q=label:"good first issue" state:open
```

Query examples:
- `label:"good first issue" state:open` - All good first issues
- `label:"good first issue" language:javascript state:open` - JavaScript issues
- `label:documentation state:open` - Documentation issues

### 2. Rate Limit Check
```
GET /api/v1/github/rate-limit
```

Returns current rate limit status and remaining requests.

## Frontend Integration

The `GoodFirstIssues` component automatically:
1. Tries backend proxy first (`/api/v1/github/search/issues`)
2. Falls back to direct GitHub API if backend fails
3. Shows sample data if both fail

## Testing

1. Start backend: `python -m uvicorn app.main:app --reload --port 8000`
2. Test rate limit: `curl http://localhost:8000/api/v1/github/rate-limit`
3. Test search: `curl "http://localhost:8000/api/v1/github/search/issues?q=label:good-first-issue%20state:open"`

## Security Notes

- ✅ Token is stored server-side only
- ✅ Frontend never sees the token
- ✅ Backend proxies requests securely
- ⚠️ For production, use GitHub App instead of personal token