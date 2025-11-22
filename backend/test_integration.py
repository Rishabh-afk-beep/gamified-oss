"""
Full integration test for AI chat system
Tests: Environment → Backend Service → API Endpoint → Response
"""

import asyncio
import aiohttp
import json
from dotenv import load_dotenv
import os

# Load environment
load_dotenv(dotenv_path=".env.local")

async def test_full_integration():
    """Test the complete AI chat flow"""
    
    print("🧪 Testing Full AI Chat Integration")
    print("=" * 50)
    
    # 1. Test environment variables
    print("1️⃣ Testing Environment Configuration...")
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
    
    if api_key:
        print("   ✅ GEMINI_API_KEY found")
    else:
        print("   ❌ GEMINI_API_KEY missing")
        return False
    
    # 2. Test AI Service directly
    print("\n2️⃣ Testing AI Service...")
    try:
        from app.services.ai_service import AIService
        ai_service = AIService()
        
        test_response = await ai_service.chat(
            "Hello! Can you help me with Python?",
            "test_user",
            "Testing AI integration"
        )
        
        if test_response["success"]:
            print("   ✅ AI Service working")
            print(f"   📝 Response: {test_response['response'][:100]}...")
        else:
            print(f"   ❌ AI Service failed: {test_response.get('error')}")
            return False
            
    except Exception as e:
        print(f"   ❌ AI Service error: {e}")
        return False
    
    # 3. Test API endpoint
    print("\n3️⃣ Testing API Endpoint...")
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "message": "What is a variable in programming?",
                "context": "Learning programming basics",
                "user_id": "test_user"
            }
            
            async with session.post(
                "http://localhost:8000/api/v1/ai/chat",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    print("   ✅ API Endpoint working")
                    print(f"   📝 API Response: {data.get('response', 'No response')[:100]}...")
                else:
                    print(f"   ❌ API Endpoint failed: {response.status}")
                    error_text = await response.text()
                    print(f"   📝 Error: {error_text}")
                    return False
                    
    except aiohttp.ClientConnectorError:
        print("   ⚠️  Backend server not running")
        print("   💡 Start server with: uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"   ❌ API test error: {e}")
        return False
    
    # 4. All tests passed
    print("\n🎉 INTEGRATION TEST PASSED!")
    print("\n✅ Your AI chat system is ready:")
    print("   • Environment configured correctly")
    print("   • AI service working") 
    print("   • API endpoints responding")
    print("   • Frontend can now connect successfully")
    
    print("\n🚀 Next steps:")
    print("   1. Start frontend: npm run dev")
    print("   2. Test the AI chat page")
    print("   3. Verify responses in browser console")
    
    return True

if __name__ == "__main__":
    asyncio.run(test_full_integration())
