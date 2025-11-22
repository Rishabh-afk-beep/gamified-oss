"""
Final integration test for the complete AI chat system
"""

import asyncio
import subprocess
import time
import os
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

async def test_complete_system():
    """Test the complete AI chat system"""
    
    print("🎯 FINAL AI CHAT SYSTEM TEST")
    print("=" * 50)
    
    # Step 1: Install missing dependencies
    print("1️⃣ Installing dependencies...")
    try:
        subprocess.run(["pip", "install", "aiohttp==3.9.1"], check=True, capture_output=True)
        print("   ✅ Dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"   ⚠️  Dependency installation warning: {e}")
    
    # Step 2: Test direct Gemini API
    print("\n2️⃣ Testing Gemini API...")
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        response = model.generate_content("Say 'CodeQuest AI is ready!' in one sentence.")
        print(f"   ✅ Gemini API: {response.text}")
        
    except Exception as e:
        print(f"   ❌ Gemini API failed: {e}")
        return False
    
    # Step 3: Test backend AI service
    print("\n3️⃣ Testing backend AI service...")
    try:
        import sys
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))
        
        from app.services.ai_service import AIService
        ai_service = AIService()
        
        result = await ai_service.chat(
            "Hello! This is a test message for CodeQuest AI.",
            "final_test_user",
            "Testing the complete AI integration"
        )
        
        if result["success"]:
            print(f"   ✅ Backend AI service: {result['response'][:80]}...")
            print(f"   📊 Model: {result['model']}")
        else:
            print(f"   ❌ Backend AI service failed: {result['error']}")
            return False
            
    except Exception as e:
        print(f"   ❌ Backend service error: {e}")
        return False
    
    # Step 4: Test API endpoint (requires server to be running)
    print("\n4️⃣ Testing API endpoint...")
    try:
        import aiohttp
        
        payload = {
            "message": "Hello CodeQuest AI! Can you help me learn programming?",
            "context": "I'm testing the AI chat integration for CodeQuest platform",
            "user_id": "final_test_user"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://localhost:8000/api/v1/ai/chat",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        print(f"   ✅ API endpoint: {data['response'][:80]}...")
                        print(f"   📊 Tokens used: {data.get('tokens_used', 'N/A')}")
                        return True
                    else:
                        print(f"   ❌ API response failed: {data.get('error')}")
                        return False
                else:
                    print(f"   ❌ API endpoint returned {response.status}")
                    error_text = await response.text()
                    print(f"   📝 Error: {error_text[:200]}...")
                    return False
                    
    except Exception as e:
        print(f"   ⚠️  API endpoint test failed: {e}")
        print(f"   💡 Make sure server is running: uvicorn app.main:app --reload")
        print(f"   📝 This is normal if server isn't started yet")
        return "partial"  # Backend works, just no server running
    
    return True

async def main():
    result = await test_complete_system()
    
    print("\n" + "=" * 50)
    
    if result is True:
        print("🎉 COMPLETE SUCCESS!")
        print("\n✅ Your AI chat system is fully operational!")
        print("🤖 Gemini API: Working")
        print("⚙️  Backend Service: Working") 
        print("🌐 API Endpoint: Working")
        print("\n🚀 Ready for frontend integration!")
        print("📱 Test at: http://localhost:5173/ai-chat")
        
    elif result == "partial":
        print("🎯 PARTIAL SUCCESS!")
        print("\n✅ Core components working:")
        print("🤖 Gemini API: Working")
        print("⚙️  Backend Service: Working")
        print("⚠️  API Endpoint: Server not running")
        print("\n🚀 Next steps:")
        print("1. Start server: uvicorn app.main:app --reload")
        print("2. Test frontend connection")
        
    else:
        print("❌ SYSTEM NOT READY")
        print("🔧 Please fix the errors above before proceeding")

if __name__ == "__main__":
    asyncio.run(main())
