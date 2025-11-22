"""
Complete setup script to finalize the AI chat system
"""

import os
import subprocess
import asyncio

async def complete_setup():
    print("🔧 COMPLETING AI CHAT SETUP")
    print("=" * 40)
    
    # Step 1: Create missing route files
    print("1️⃣ Creating missing route files...")
    try:
        exec(open('create_missing_routes.py').read())
        print("   ✅ Route files created")
    except Exception as e:
        print(f"   ❌ Failed to create routes: {e}")
    
    # Step 2: Install missing dependencies
    print("\n2️⃣ Installing dependencies...")
    try:
        subprocess.run(["pip", "install", "motor", "pymongo", "aiohttp"], check=True, capture_output=True)
        print("   ✅ Dependencies installed")
    except Exception as e:
        print(f"   ⚠️ Dependency installation: {e}")
    
    # Step 3: Test the complete system
    print("\n3️⃣ Testing complete system...")
    try:
        # Test Gemini API
        import google.generativeai as genai
        from dotenv import load_dotenv
        
        load_dotenv('.env.local')
        api_key = os.getenv("GEMINI_API_KEY")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content("Say 'Setup complete!'")
        
        print(f"   ✅ AI Test: {response.text}")
        
        # Test backend imports
        import sys
        sys.path.insert(0, 'app')
        
        from core.config import settings
        from services.ai_service import AIService
        
        ai_service = AIService()
        result = await ai_service.chat("Hello!", "setup_test")
        
        if result["success"]:
            print(f"   ✅ Backend Test: {result['response'][:50]}...")
        else:
            print(f"   ❌ Backend Test Failed: {result['error']}")
            
    except Exception as e:
        print(f"   ❌ System test failed: {e}")
    
    print("\n🎉 SETUP COMPLETE!")
    print("\n📋 FINAL STEPS:")
    print("1. Start backend: uvicorn app.main:app --reload")
    print("2. Start frontend: npm run dev")
    print("3. Test AI chat at: http://localhost:5173/ai-chat")
    print("4. Check browser console for any errors")

if __name__ == "__main__":
    asyncio.run(complete_setup())
