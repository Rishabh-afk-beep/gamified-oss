"""
Quick diagnostic script to identify AI chat issues
"""

import os
import sys
import asyncio
import json
from dotenv import load_dotenv

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def diagnose():
    print("🔍 DIAGNOSING AI CHAT SYSTEM")
    print("=" * 50)
    
    # 1. Check environment variables
    print("1️⃣ Checking Environment Variables...")
    
    # Try different env files
    env_files = [".env.local", ".env", ".env.example"]
    loaded_env = None
    
    for env_file in env_files:
        if os.path.exists(env_file):
            load_dotenv(dotenv_path=env_file, override=True)
            loaded_env = env_file
            print(f"   📁 Loaded: {env_file}")
            break
    
    if not loaded_env:
        print("   ❌ No environment file found")
        return False
    
    # Check critical variables
    gemini_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
    
    print(f"   🔑 GEMINI_API_KEY: {'✅ Found' if gemini_key and len(gemini_key) > 20 else '❌ Missing/Invalid'}")
    print(f"   🤖 GEMINI_MODEL: {model}")
    
    if not gemini_key or gemini_key == "your_actual_gemini_api_key_here":
        print("   ❌ Invalid API key detected")
        return False
    
    # 2. Test Gemini API directly
    print("\n2️⃣ Testing Gemini API...")
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=gemini_key)
        model_instance = genai.GenerativeModel(model)
        
        response = model_instance.generate_content(
            "Say 'Hello from CodeQuest!' in one sentence.",
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=50,
                temperature=0.1
            )
        )
        
        print("   ✅ Gemini API working")
        print(f"   📝 Response: {response.text}")
        
    except Exception as e:
        print(f"   ❌ Gemini API failed: {e}")
        return False
    
    # 3. Test AI Service
    print("\n3️⃣ Testing AI Service...")
    try:
        # Import with proper path handling
        from core.config import settings
        from services.ai_service import AIService
        
        ai_service = AIService()
        
        test_response = await ai_service.chat(
            "Hello! Test message.",
            "test_user",
            "Testing integration"
        )
        
        if test_response.get("success"):
            print("   ✅ AI Service working")
            print(f"   📝 Response: {test_response['response'][:100]}...")
        else:
            print(f"   ❌ AI Service failed: {test_response.get('error')}")
            return False
            
    except Exception as e:
        print(f"   ❌ AI Service error: {e}")
        print(f"   💡 Try: cd backend && python -m app.main")
        return False
    
    # 4. Test API endpoint
    print("\n4️⃣ Testing API Endpoint...")
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
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    print("   ✅ API Endpoint working")
                    print(f"   📝 Response: {data.get('response', 'No response')[:100]}...")
                else:
                    print(f"   ❌ API returned status: {response.status}")
                    error_text = await response.text()
                    print(f"   📝 Error: {error_text}")
                    return False
    
    except aiohttp.ClientConnectorError:
        print("   ⚠️  Backend server not running")
        print("   💡 Start with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        print(f"   ❌ API test failed: {e}")
        return False
    
    print("\n🎉 ALL TESTS PASSED!")
    print("\n✅ Your system is ready. If frontend still fails, check:")
    print("   • Browser console for CORS errors")
    print("   • Frontend API URL configuration")
    print("   • Network connectivity")
    
    return True

if __name__ == "__main__":
    # Update .env.local with working API key
    env_local = ".env.local"
    working_key = "AIzaSyD6C_GYuGvgm8phAi37DKg_FXGxlaRCjKA"
    
    print("🔧 Updating .env.local with working API key...")
    
    if os.path.exists(env_local):
        with open(env_local, 'r') as f:
            content = f.read()
        
        # Update or add API key
        lines = content.split('\n')
        updated_lines = []
        key_found = False
        
        for line in lines:
            if line.startswith('GEMINI_API_KEY='):
                updated_lines.append(f'GEMINI_API_KEY={working_key}')
                key_found = True
            else:
                updated_lines.append(line)
        
        if not key_found:
            updated_lines.append(f'GEMINI_API_KEY={working_key}')
        
        with open(env_local, 'w') as f:
            f.write('\n'.join(updated_lines))
    else:
        # Create new .env.local
        with open(env_local, 'w') as f:
            f.write(f"""APP_NAME=CodeQuest
DEBUG=true
MONGODB_URL=mongodb://localhost:27017/codequest
SECRET_KEY=dev-secret-key-change-in-production
GEMINI_API_KEY={working_key}
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
""")
    
    print("✅ Updated .env.local")
    
    # Run diagnosis
    asyncio.run(diagnose())
