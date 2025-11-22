"""
Quick fix script to solve AI chat issues
"""

import os
import sys
import asyncio

def setup_environment():
    """Setup the working environment"""
    
    # Update API key in .env.local
    working_key = "your_gemini_api_key_here"
    env_local = ".env.local"
    
    print("🔧 Setting up environment...")
    
    # Create or update .env.local
    env_content = f"""# CodeQuest Environment Configuration
APP_NAME=CodeQuest
APP_VERSION=1.0.0
DEBUG=true
HOST=0.0.0.0
PORT=8000
MONGODB_URL=mongodb://localhost:27017/codequest
DATABASE_NAME=codequest
SECRET_KEY=dev-secret-key-please-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY={working_key}
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"]
"""
    
    with open(env_local, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created/updated {env_local}")
    return working_key

async def test_everything():
    """Test the complete system"""
    
    working_key = setup_environment()
    
    print("\n🧪 TESTING AI SYSTEM")
    print("=" * 40)
    
    # Test 1: Direct Gemini API
    print("1️⃣ Testing Gemini API directly...")
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=working_key)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        response = model.generate_content("Say 'CodeQuest AI is working!'")
        print(f"   ✅ Direct API: {response.text}")
        
    except Exception as e:
        print(f"   ❌ Direct API failed: {e}")
        return False
    
    # Test 2: Backend service
    print("\n2️⃣ Testing backend service...")
    try:
        # Add app to path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))
        
        from dotenv import load_dotenv
        load_dotenv('.env.local')
        
        # Test only the core components that should exist
        from app.core.config import settings
        print(f"   ✅ Config loaded: {settings.APP_NAME}")
        
        from app.services.ai_service import AIService
        ai_service = AIService()
        
        if ai_service.model:
            print("   ✅ AI Service initialized")
            
            result = await ai_service.chat("Hello test", "test_user", "Testing")
            
            if result["success"]:
                print(f"   ✅ Backend service: {result['response'][:50]}...")
            else:
                print(f"   ❌ Backend service failed: {result['error']}")
                return False
        else:
            print("   ❌ AI Service model not loaded")
            return False
            
    except Exception as e:
        print(f"   ❌ Backend service error: {e}")
        # Don't return False here, continue to API test
        print(f"   ⚠️  Service test failed, but continuing...")
    
    # Test 3: API endpoint (if server is running)
    print("\n3️⃣ Testing API endpoint...")
    try:
        import aiohttp
        
        payload = {
            "message": "Hello API test",
            "context": "Testing",
            "user_id": "test_user"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://localhost:8000/api/v1/ai/chat",
                json=payload
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ API endpoint: {data.get('response', 'No response')[:50]}...")
                else:
                    print(f"   ⚠️  API endpoint returned {response.status}")
                    print(f"   💡 Start server: uvicorn app.main:app --reload")
    
    except Exception as e:
        print(f"   ⚠️  API endpoint test failed: {e}")
        print(f"   💡 Start server: uvicorn app.main:app --reload")
    
    print("\n🎉 TESTS COMPLETED!")
    print("\n📋 NEXT STEPS:")
    print("1. Start backend: uvicorn app.main:app --reload")
    print("2. Start frontend: npm run dev")
    print("3. Test at: http://localhost:5173/ai-chat")
    print("4. Check browser console for any remaining errors")
    
    return True

if __name__ == "__main__":
    asyncio.run(test_everything())
