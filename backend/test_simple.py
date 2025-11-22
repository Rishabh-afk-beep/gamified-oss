"""
Simple test script to verify AI integration
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

async def simple_test():
    print("🧪 SIMPLE AI TEST")
    print("=" * 30)
    
    # Test 1: Environment
    print("1️⃣ Checking environment...")
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
    
    print(f"   API Key: {'✅ Found' if api_key and len(api_key) > 20 else '❌ Missing'}")
    print(f"   Model: {model}")
    
    if not api_key:
        print("❌ No API key found")
        return False
    
    # Test 2: Direct Gemini
    print("\n2️⃣ Testing Gemini directly...")
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        model_instance = genai.GenerativeModel(model)
        
        response = model_instance.generate_content("Say 'Hello from CodeQuest!'")
        print(f"   ✅ Success: {response.text}")
        
    except Exception as e:
        print(f"   ❌ Failed: {e}")
        return False
    
    # Test 3: Backend imports
    print("\n3️⃣ Testing backend imports...")
    try:
        # Add app to path
        app_path = os.path.join(os.path.dirname(__file__), 'app')
        if app_path not in sys.path:
            sys.path.insert(0, app_path)
        
        # Test imports
        from core.config import settings as test_settings
        print(f"   ✅ Config loaded: {test_settings.APP_NAME}")
        
        # Test AI service
        from services.ai_service import AIService
        ai_service = AIService()
        
        if ai_service.model:
            print("   ✅ AI Service initialized")
            
            # Test chat
            result = await ai_service.chat("Hello test", "test_user")
            if result["success"]:
                print(f"   ✅ Chat working: {result['response'][:50]}...")
            else:
                print(f"   ❌ Chat failed: {result['error']}")
                return False
        else:
            print("   ❌ AI Service model not loaded")
            return False
        
    except Exception as e:
        print(f"   ❌ Import failed: {e}")
        return False
    
    print("\n🎉 ALL TESTS PASSED!")
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Start server: uvicorn app.main:app --reload")
    print("3. Test frontend")
    
    return True

if __name__ == "__main__":
    asyncio.run(simple_test())
