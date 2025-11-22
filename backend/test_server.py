"""
Test if the server starts properly with the current configuration
"""

import asyncio
import aiohttp
import time
import subprocess
import os
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

async def test_server_startup():
    """Test if the server can start and respond"""
    
    print("🧪 TESTING SERVER STARTUP")
    print("=" * 40)
    
    # Test basic health endpoint
    print("1️⃣ Testing server health...")
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get("http://localhost:8000/api/v1/health") as response:
                    if response.status == 200:
                        data = await response.json()
                        print("   ✅ Server is healthy!")
                        print(f"   📊 Status: {data}")
                        break
                    else:
                        print(f"   ⚠️  Health check returned {response.status}")
        except aiohttp.ClientConnectorError:
            if attempt < max_retries - 1:
                print(f"   ⏳ Server not ready, retrying... ({attempt + 1}/{max_retries})")
                await asyncio.sleep(2)
            else:
                print("   ❌ Server is not running")
                print("   💡 Start with: uvicorn app.main:app --reload")
                return False
        except Exception as e:
            print(f"   ❌ Health check failed: {e}")
            return False
    
    # Test AI chat endpoint
    print("\n2️⃣ Testing AI chat endpoint...")
    try:
        payload = {
            "message": "Hello! Test message for CodeQuest AI.",
            "context": "Testing the API integration",
            "user_id": "test_user"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://localhost:8000/api/v1/ai/chat",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        print("   ✅ AI chat endpoint working!")
                        print(f"   🤖 Response: {data['response'][:100]}...")
                        return True
                    else:
                        print(f"   ❌ AI chat failed: {data.get('error')}")
                        return False
                else:
                    print(f"   ❌ AI chat endpoint returned {response.status}")
                    error_text = await response.text()
                    print(f"   📝 Error: {error_text}")
                    return False
                    
    except Exception as e:
        print(f"   ❌ AI chat test failed: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_server_startup())
    
    if result:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n✅ Your AI chat system is working!")
        print("📱 Frontend can now connect successfully")
        print("🌐 Test at: http://localhost:5173/ai-chat")
    else:
        print("\n❌ Some tests failed.")
        print("🔧 Check the server logs for more details")
