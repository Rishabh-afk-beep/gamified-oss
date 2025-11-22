import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

# Try loading from multiple possible env files
env_files = [".env.local", ".env", ".env.example"]
api_key = None

# First, try to use the new API key directly for testing
test_api_key = "AIzaSyB9glcjyAZVz9plKqAB6gMKTuNAgJ1t8Fg"

for env_file in env_files:
    if os.path.exists(env_file):
        print(f"🔍 Loading environment from: {env_file}")
        load_dotenv(dotenv_path=env_file)
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_actual_gemini_api_key_here":
            break
        else:
            print(f"⚠️  No valid API key found in {env_file}")

# Use the test API key if no valid key found in env files
if not api_key or api_key == "your_actual_gemini_api_key_here":
    print("🔑 Using provided test API key...")
    api_key = test_api_key

print(f"🔑 GEMINI_API_KEY: {'Found' if api_key and len(api_key) > 10 else 'Not found or invalid'}")

if not api_key:
    print("❌ No valid API key found. Please:")
    print("   1. Copy .env.example to .env.local")
    print("   2. Replace GEMINI_API_KEY with your actual API key")
    print("   3. Get your API key from: https://aistudio.google.com/app/apikey")
    exit()

# Configure Gemini API
genai.configure(api_key=api_key)

# Test the API with multiple models in order of preference
print("\n🧪 Testing Gemini API with new key...")

# Models to try in order (starting with more stable/reliable ones)
test_models = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest", 
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash"
]

working_model = None
success = False

for model_name in test_models:
    try:
        print(f"\n🔄 Trying model: {model_name}")
        model = genai.GenerativeModel(model_name)
        
        # Use a shorter test message to reduce token usage
        response = model.generate_content(
            "Hello! Say 'CodeQuest AI ready!' in one sentence.",
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=50,
                temperature=0.1
            )
        )
        
        print("✅ Gemini API Response:")
        print(f"   {response.text}")
        print(f"\n🎉 SUCCESS! Gemini integration is working with model: {model_name}")
        working_model = model_name
        success = True
        break
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg and "quota" in error_msg.lower():
            print(f"⚠️  Quota exceeded for {model_name}, trying next model...")
            continue
        elif "400" in error_msg:
            print(f"⚠️  Model {model_name} not accessible, trying next...")
            continue
        elif "403" in error_msg or "invalid" in error_msg.lower():
            print(f"❌ API key authentication failed with {model_name}")
            break
        else:
            print(f"❌ Error with {model_name}: {e}")
            continue

if success:
    print(f"\n🎊 EXCELLENT! API key is working perfectly!")
    print(f"📝 Working model: {working_model}")
    print(f"🔧 Now updating your environment files...")
    
    # Update .env.local file
    env_local_path = ".env.local"
    if os.path.exists(env_local_path):
        # Read current content
        with open(env_local_path, 'r') as f:
            content = f.read()
        
        # Replace the API key line
        lines = content.split('\n')
        updated_lines = []
        key_updated = False
        
        for line in lines:
            if line.startswith('GEMINI_API_KEY='):
                updated_lines.append(f'GEMINI_API_KEY={test_api_key}')
                key_updated = True
            elif line.startswith('GEMINI_MODEL='):
                updated_lines.append(f'GEMINI_MODEL={working_model}')
            else:
                updated_lines.append(line)
        
        if not key_updated:
            updated_lines.append(f'GEMINI_API_KEY={test_api_key}')
            updated_lines.append(f'GEMINI_MODEL={working_model}')
        
        # Write back to file
        with open(env_local_path, 'w') as f:
            f.write('\n'.join(updated_lines))
        
        print(f"✅ Updated {env_local_path} with working API key and model")
    else:
        print(f"⚠️  {env_local_path} not found. Creating it...")
        # Create new .env.local file
        with open(env_local_path, 'w') as f:
            f.write(f"""# CodeQuest Environment Configuration
APP_NAME=CodeQuest
DEBUG=true
MONGODB_URL=mongodb://localhost:27017/codequest
SECRET_KEY=your-super-secret-key-here
GEMINI_API_KEY={test_api_key}
GEMINI_MODEL={working_model}
GEMINI_MAX_TOKENS=500
GEMINI_TEMPERATURE=0.7
""")
        print(f"✅ Created {env_local_path} with working configuration")
    
    print("\n🚀 Next steps:")
    print("   1. Your API key is confirmed working")
    print(f"   2. Best model for your setup: {working_model}")
    print("   3. Start your backend server: uvicorn app.main:app --reload")
    print("   4. Test the AI chat endpoint")
    
else:
    print("\n❌ API key testing failed.")
    print("💡 Possible issues:")
    print("   1. API key might be invalid or expired")
    print("   2. Gemini API might not be enabled for your project")
    print("   3. Quota/billing issues")
    print("   4. Geographic restrictions")
    print(f"\n⏱️  Current time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
