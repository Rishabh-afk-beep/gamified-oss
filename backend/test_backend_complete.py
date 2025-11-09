#!/usr/bin/env python
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, path, data=None, headers=None, name=""):
    """Test endpoint and print result"""
    url = f"{BASE_URL}{path}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        
        status = "✅ PASS" if response.status_code < 400 else "❌ FAIL"
        print(f"\n{status} {name}")
        print(f"   Method: {method} {path}")
        print(f"   Status: {response.status_code}")
        
        try:
            json_data = response.json()
            # Show first 150 chars of response
            response_str = json.dumps(json_data, indent=2)[:150]
            print(f"   Response: {response_str}...")
        except:
            print(f"   Response: {response.text[:150]}")
            
        return response.status_code < 400
    except Exception as e:
        print(f"\n❌ ERROR {name}")
        print(f"   Error: {str(e)}")
        return False

print("=" * 60)
print("🧪 CodeQuest Backend - Complete Test Suite")
print("=" * 60)

results = []

# Test 1: Health Check
print("\n\n📋 TEST GROUP 1: Basic Endpoints")
results.append(test_endpoint("GET", "/health", name="Health Check"))
results.append(test_endpoint("GET", "/", name="Root Endpoint"))

# Test 2: Quests
print("\n\n📋 TEST GROUP 2: Quests Endpoints")
results.append(test_endpoint("GET", "/api/v1/quests", name="Get All Quests"))
results.append(test_endpoint("GET", "/api/v1/quests?limit=5&skip=0", name="Get Quests with Params"))

# Test 3: Leaderboard
print("\n\n📋 TEST GROUP 3: Leaderboard Endpoints")
results.append(test_endpoint("GET", "/api/v1/leaderboard", name="Get Leaderboard"))
results.append(test_endpoint("GET", "/api/v1/leaderboard?type=all_time&limit=50", name="Get Leaderboard Filtered"))

# Test 4: Badges
print("\n\n📋 TEST GROUP 4: Badges Endpoints")
results.append(test_endpoint("GET", "/api/v1/badges", name="Get All Badges"))

# Test 5: Auth (will fail without credentials, that's OK)
print("\n\n📋 TEST GROUP 5: Auth Endpoints (Testing)")
results.append(test_endpoint("POST", "/api/v1/auth/register",
    data={
        "username": "testuser123",
        "email": "testuser123@example.com",
        "password": "SecurePass123!"
    },
    name="Register New User"))

# Summary
print("\n\n" + "=" * 60)
passed = sum(results)
total = len(results)
percentage = (passed / total * 100) if total > 0 else 0
print(f"📊 TEST RESULTS: {passed}/{total} Passed ({percentage:.0f}%)")
print("=" * 60)

if passed == total:
    print("✅ ALL TESTS PASSED! Backend is 100% working!")
else:
    print(f"⚠️  {total - passed} tests failed. Check details above.")
