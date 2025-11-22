"""
Verify the new API key and update all configuration files
"""

import os
import google.generativeai as genai

# Your new API key
NEW_API_KEY = "AIzaSyB9glcjyAZVz9plKqAB6gMKTuNAgJ1t8Fg"

def test_new_api_key():
    """Test if the new API key works"""
    print("🔑 Testing new API key...")
    
    try:
        genai.configure(api_key=NEW_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        response = model.generate_content("Say 'New CodeQuest API key is working!'")
        print(f"✅ API key test successful: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ API key test failed: {e}")
        return False

def update_env_local():
    """Update .env.local with the new API key"""
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
GEMINI_API_KEY={NEW_API_KEY}
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"]
"""
    
    with open('.env.local', 'w') as f:
        f.write(env_content)
    
    print("✅ Updated .env.local with new API key")

if __name__ == "__main__":
    print("🔧 VERIFYING NEW API KEY")
    print("=" * 40)
    
    # Test the API key
    if test_new_api_key():
        # Update environment file
        update_env_local()
        
        print("\n🎉 SUCCESS! New API key is working.")
        print("\nNext steps:")
        print("1. Start backend: uvicorn app.main:app --reload")
        print("2. Start frontend: npm run dev")
        print("3. Test AI chat at: http://localhost:5173/ai-chat")
    else:
        print("\n❌ New API key failed. Please check:")
        print("- Key is correctly copied")
        print("- Gemini API is enabled")
        print("- No billing issues")
