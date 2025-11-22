"""
Final system test after setup completion
"""

import asyncio
import aiohttp
import os
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

async def test_final_system():
    """Test the complete system after setup"""
    
    print("🎯 FINAL SYSTEM TEST")
    print("=" * 50)
    
    # Test 1: Check environment
    print("1️⃣ Environment Check...")
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        print(f"   ✅ GEMINI_API_KEY: Found ({len(api_key)} chars)")
    else:
        print("   ❌ GEMINI_API_KEY: Missing")
        return False
    
    # Test 2: Test Gemini directly
    print("\n2️⃣ Direct Gemini API Test...")
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        response = model.generate_content("Say 'Final test successful!' in one sentence.")
        print(f"   ✅ Gemini: {response.text}")
        
    except Exception as e:
        print(f"   ❌ Gemini failed: {e}")
        return False
    
    # Test 3: Backend service
    print("\n3️⃣ Backend Service Test...")
    try:
        import sys
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))
        
        from app.services.ai_service import AIService
        ai_service = AIService()
        
        result = await ai_service.chat("Hello final test", "test_user", "Final testing")
        
        if result["success"]:
            print(f"   ✅ AI Service: {result['response'][:60]}...")
        else:
            print(f"   ❌ AI Service failed: {result['error']}")
            return False
            
    except Exception as e:
        print(f"   ❌ Backend service error: {e}")
        return False
    
    # Test 4: API endpoint (if server is running)
    print("\n4️⃣ API Endpoint Test...")
    try:
        payload = {
            "message": "Final test message for API",
            "context": "Testing complete system integration",
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
                        print(f"   ✅ API Endpoint: {data['response'][:60]}...")
                    else:
                        print(f"   ❌ API failed: {data.get('error')}")
                        return False
                else:
                    print(f"   ❌ API returned status: {response.status}")
                    return False
                    
    except Exception as e:
        print(f"   ⚠️  API test failed: {e}")
        print(f"   💡 Server may not be running. Start with:")
        print(f"      uvicorn app.main:app --reload")
        return "partial"
    
    print("\n🎉 ALL TESTS PASSED!")
    return True

async def main():
    result = await test_final_system()
    
    print("\n" + "=" * 50)
    
    if result is True:
        print("🎊 SYSTEM FULLY OPERATIONAL!")
        print("\n✅ Everything is working perfectly!")
        print("🤖 Gemini API: Working")
        print("⚙️  Backend Service: Working") 
        print("🌐 API Endpoint: Working")
        print("\n🚀 Ready for frontend!")
        print("📱 Start frontend: npm run dev")
        print("🌐 Test at: http://localhost:5173/ai-chat")
        
    elif result == "partial":
        print("🎯 CORE SYSTEM READY!")
        print("\n✅ Core components working:")
        print("🤖 Gemini API: Working")
        print("⚙️  Backend Service: Working")
        print("⚠️  API Endpoint: Server not running")
        print("\n🚀 Next steps:")
        print("1. uvicorn app.main:app --reload")
        print("2. npm run dev")
        print("3. Test AI chat")
        
    else:
        print("❌ SYSTEM NOT READY")
        print("🔧 Please fix the errors above")

if __name__ == "__main__":
    asyncio.run(main())
