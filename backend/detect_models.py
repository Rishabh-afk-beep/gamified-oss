"""
Detect available Gemini models and find the best working one
"""

import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment
load_dotenv('.env.local')
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ No API key found")
    exit()

# Configure API
genai.configure(api_key=api_key)

print("🔍 DETECTING AVAILABLE MODELS")
print("=" * 40)

# List all models
print("📋 All available models:")
try:
    all_models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            all_models.append(m.name)
            print(f"   ✅ {m.name}")
    
    print(f"\nTotal models: {len(all_models)}")
    
except Exception as e:
    print(f"❌ Failed to list models: {e}")
    exit()

# Test models in order of preference
print("\n🧪 TESTING MODELS")
print("=" * 40)

preferred_models = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest", 
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-pro-latest",
    "gemini-1.5-pro"
]

working_model = None

for model_name in preferred_models:
    if model_name in [m.replace("models/", "") for m in all_models]:
        try:
            print(f"\n🔄 Testing: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            response = model.generate_content(
                "Say 'Model working!' in exactly 3 words.",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=20,
                    temperature=0.1
                )
            )
            
            print(f"   ✅ SUCCESS: {response.text}")
            working_model = model_name
            break
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
            continue

if working_model:
    print(f"\n🎉 BEST MODEL FOUND: {working_model}")
    
    # Update .env.local
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
GEMINI_API_KEY={api_key}
GEMINI_MODEL={working_model}
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"]
"""
    
    with open('.env.local', 'w') as f:
        f.write(env_content)
    
    print(f"✅ Updated .env.local with working model: {working_model}")
    
    print("\n🚀 Next steps:")
    print("1. Restart server: uvicorn app.main:app --reload")
    print("2. Run: python test_server.py")
    print("3. Start frontend and test AI chat")
    
else:
    print("\n❌ No working model found!")
    print("💡 Try these solutions:")
    print("   - Check API key permissions")
    print("   - Verify Gemini API is enabled")
    print("   - Check billing/quota status")
