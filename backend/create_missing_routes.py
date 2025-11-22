"""
Create missing route files for the project
"""
import os

def create_route_file(filepath, content):
    """Create a route file with given content"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"✅ Created: {filepath}")

# Create auth routes
auth_content = '''"""
Authentication routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/health")
async def auth_health():
    """Auth service health check"""
    return {"status": "auth service pending implementation"}
'''

# Create users routes
users_content = '''"""
User management routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/health")
async def users_health():
    """Users service health check"""
    return {"status": "users service pending implementation"}
'''

# Create quests routes
quests_content = '''"""
Quest management routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/quests", tags=["quests"])

@router.get("/health")
async def quests_health():
    """Quests service health check"""
    return {"status": "quests service pending implementation"}
'''

# Create github integration routes
github_content = '''"""
GitHub integration routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/github", tags=["github"])

@router.get("/health")
async def github_health():
    """GitHub service health check"""
    return {"status": "github service pending implementation"}
'''

# Create the files
routes_dir = "app/api/v1"
create_route_file(f"{routes_dir}/auth.py", auth_content)
create_route_file(f"{routes_dir}/users.py", users_content)
create_route_file(f"{routes_dir}/quests.py", quests_content)
create_route_file(f"{routes_dir}/github_integration.py", github_content)

print("\n🎉 All route files created successfully!")
print("Now you can update app/main.py to include these routes.")
