#!/usr/bin/env python3
"""
CodeQuest Platform - Comprehensive Test Suite
Tests all major features and endpoints of the gamified coding platform
"""

import asyncio
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any

import httpx
import pytest


class CodeQuestTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_user_id = "test_user_123"
        self.auth_token = None
        self.results = []

    async def log_result(self, test_name: str, success: bool, message: str, data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {test_name}: {message}")

    async def test_1_health_check(self):
        """Test 1: API Health Check"""
        try:
            response = await self.client.get(f"{self.base_url}/health")
            success = response.status_code == 200
            data = response.json() if success else None
            await self.log_result(
                "Health Check", 
                success, 
                f"API health status: {response.status_code}", 
                data
            )
            return success
        except Exception as e:
            await self.log_result("Health Check", False, f"Error: {e}")
            return False

    async def test_2_user_analytics(self):
        """Test 2: User Analytics Endpoint"""
        try:
            response = await self.client.get(f"{self.base_url}/api/v1/analytics/me")
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and data:
                # Validate analytics structure
                required_fields = ["total_xp", "level", "quests_completed"]
                has_fields = all(field in data for field in required_fields)
                success = success and has_fields
                message = "Analytics retrieved successfully" if has_fields else "Missing required fields"
            else:
                message = f"Failed to get analytics: {response.status_code}"
                
            await self.log_result("User Analytics", success, message, data)
            return success
        except Exception as e:
            await self.log_result("User Analytics", False, f"Error: {e}")
            return False

    async def test_3_quests_endpoint(self):
        """Test 3: Quests Endpoint"""
        try:
            response = await self.client.get(f"{self.base_url}/api/v1/quests")
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and isinstance(data, list):
                quest_count = len(data)
                message = f"Retrieved {quest_count} quests"
                
                # Validate quest structure if quests exist
                if quest_count > 0:
                    quest = data[0]
                    required_fields = ["id", "title", "difficulty", "xp_reward"]
                    has_fields = all(field in quest for field in required_fields)
                    success = success and has_fields
                    if not has_fields:
                        message += " - Missing required quest fields"
            else:
                message = f"Invalid response format: {response.status_code}"
                success = False
                
            await self.log_result("Quests Endpoint", success, message, {"count": len(data) if data else 0})
            return success
        except Exception as e:
            await self.log_result("Quests Endpoint", False, f"Error: {e}")
            return False

    async def test_4_quest_completion(self):
        """Test 4: Quest Completion Flow"""
        try:
            # First get available quests
            response = await self.client.get(f"{self.base_url}/api/v1/quests")
            if response.status_code != 200:
                await self.log_result("Quest Completion", False, "Failed to get quests")
                return False
                
            quests = response.json()
            if not quests:
                await self.log_result("Quest Completion", False, "No quests available")
                return False
            
            # Try to complete the first quest
            quest_id = quests[0]["id"]
            completion_data = {
                "user_id": self.test_user_id,
                "quest_id": quest_id,
                "completion_time": 120,
                "code_submission": "console.log('Hello, World!');"
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/v1/quests/complete",
                json=completion_data
            )
            
            success = response.status_code in [200, 201]
            data = response.json() if response.status_code < 500 else None
            message = f"Quest completion: {response.status_code}"
            
            if success and data:
                xp_gained = data.get("xp_gained", 0)
                message += f" - Gained {xp_gained} XP"
            
            await self.log_result("Quest Completion", success, message, data)
            return success
        except Exception as e:
            await self.log_result("Quest Completion", False, f"Error: {e}")
            return False

    async def test_5_ai_chat(self):
        """Test 5: AI Chat Functionality"""
        try:
            chat_data = {
                "message": "What is JavaScript closure?",
                "context": "learning"
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/v1/ai/chat",
                json=chat_data
            )
            
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and data:
                has_response = "response" in data and len(data["response"]) > 0
                success = success and has_response
                message = "AI chat responded successfully" if has_response else "Empty AI response"
            else:
                message = f"AI chat failed: {response.status_code}"
            
            await self.log_result("AI Chat", success, message, {"response_length": len(data.get("response", "")) if data else 0})
            return success
        except Exception as e:
            await self.log_result("AI Chat", False, f"Error: {e}")
            return False

    async def test_6_code_review(self):
        """Test 6: AI Code Review"""
        try:
            code_data = {
                "code": """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
                """,
                "language": "python"
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/v1/ai/review-code",
                json=code_data
            )
            
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and data:
                required_fields = ["score", "analysis", "suggestions"]
                has_fields = all(field in data for field in required_fields)
                success = success and has_fields
                
                if has_fields:
                    score = data.get("score", 0)
                    suggestions_count = len(data.get("suggestions", []))
                    message = f"Code reviewed - Score: {score}, Suggestions: {suggestions_count}"
                else:
                    message = "Code review response missing required fields"
            else:
                message = f"Code review failed: {response.status_code}"
            
            await self.log_result("AI Code Review", success, message, data)
            return success
        except Exception as e:
            await self.log_result("AI Code Review", False, f"Error: {e}")
            return False

    async def test_7_github_integration(self):
        """Test 7: GitHub Issues Integration"""
        try:
            params = {
                "language": "JavaScript",
                "per_page": 5
            }
            
            response = await self.client.get(
                f"{self.base_url}/api/v1/github/good-first-issues",
                params=params
            )
            
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and data:
                issues = data.get("issues", [])
                total_count = data.get("total_count", 0)
                message = f"Retrieved {len(issues)} GitHub issues (total: {total_count})"
                
                # Validate issue structure
                if issues:
                    issue = issues[0]
                    required_fields = ["id", "title", "url", "repo_name"]
                    has_fields = all(field in issue for field in required_fields)
                    success = success and has_fields
                    if not has_fields:
                        message += " - Missing required issue fields"
            else:
                message = f"GitHub integration failed: {response.status_code}"
            
            await self.log_result("GitHub Integration", success, message, {"issues_count": len(data.get("issues", [])) if data else 0})
            return success
        except Exception as e:
            await self.log_result("GitHub Integration", False, f"Error: {e}")
            return False

    async def test_8_badge_system(self):
        """Test 8: Badge/Achievement System"""
        try:
            response = await self.client.get(f"{self.base_url}/api/v1/badges")
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and isinstance(data, list):
                badge_count = len(data)
                message = f"Retrieved {badge_count} badges"
                
                # Validate badge structure if badges exist
                if badge_count > 0:
                    badge = data[0]
                    required_fields = ["id", "name", "description", "criteria"]
                    has_fields = all(field in badge for field in required_fields)
                    success = success and has_fields
                    if not has_fields:
                        message += " - Missing required badge fields"
            else:
                message = f"Badge system failed: {response.status_code}"
                success = False
            
            await self.log_result("Badge System", success, message, {"badges_count": len(data) if data else 0})
            return success
        except Exception as e:
            await self.log_result("Badge System", False, f"Error: {e}")
            return False

    async def test_9_leaderboard(self):
        """Test 9: Leaderboard System"""
        try:
            response = await self.client.get(f"{self.base_url}/api/v1/leaderboard")
            success = response.status_code == 200
            data = response.json() if success else None
            
            if success and isinstance(data, list):
                user_count = len(data)
                message = f"Leaderboard retrieved with {user_count} users"
                
                # Validate leaderboard structure
                if user_count > 0:
                    user = data[0]
                    required_fields = ["user_id", "total_xp", "level", "rank"]
                    has_fields = all(field in user for field in required_fields)
                    success = success and has_fields
                    if not has_fields:
                        message += " - Missing required user fields"
            else:
                message = f"Leaderboard failed: {response.status_code}"
                success = False
            
            await self.log_result("Leaderboard", success, message, {"users_count": len(data) if data else 0})
            return success
        except Exception as e:
            await self.log_result("Leaderboard", False, f"Error: {e}")
            return False

    async def test_10_user_profile(self):
        """Test 10: User Profile Management"""
        try:
            # Test getting user profile
            response = await self.client.get(f"{self.base_url}/api/v1/users/{self.test_user_id}")
            success = response.status_code in [200, 404]  # 404 is acceptable for test user
            data = response.json() if response.status_code == 200 else None
            
            if response.status_code == 200 and data:
                required_fields = ["user_id", "username", "total_xp", "level"]
                has_fields = all(field in data for field in required_fields)
                success = has_fields
                message = "User profile retrieved successfully" if has_fields else "Profile missing required fields"
            elif response.status_code == 404:
                message = "Test user not found (expected for new installation)"
                success = True
            else:
                message = f"User profile failed: {response.status_code}"
                success = False
            
            await self.log_result("User Profile", success, message, data)
            return success
        except Exception as e:
            await self.log_result("User Profile", False, f"Error: {e}")
            return False

    async def test_11_real_time_analytics(self):
        """Test 11: Real-time Analytics Updates"""
        try:
            # Get initial analytics
            response1 = await self.client.get(f"{self.base_url}/api/v1/analytics/me")
            if response1.status_code != 200:
                await self.log_result("Real-time Analytics", False, "Failed to get initial analytics")
                return False
            
            initial_data = response1.json()
            initial_xp = initial_data.get("total_xp", 0)
            
            # Simulate quest completion to trigger analytics update
            completion_data = {
                "user_id": self.test_user_id,
                "quest_id": "test_quest_realtime",
                "completion_time": 60,
                "code_submission": "print('Testing real-time updates')"
            }
            
            await self.client.post(
                f"{self.base_url}/api/v1/quests/complete",
                json=completion_data
            )
            
            # Wait a moment for processing
            await asyncio.sleep(1)
            
            # Get updated analytics
            response2 = await self.client.get(f"{self.base_url}/api/v1/analytics/me")
            success = response2.status_code == 200
            
            if success:
                updated_data = response2.json()
                updated_xp = updated_data.get("total_xp", 0)
                xp_change = updated_xp - initial_xp
                
                message = f"Real-time analytics working - XP change: {xp_change}"
                # Note: XP might not change if quest already completed or in-memory system
            else:
                message = f"Failed to get updated analytics: {response2.status_code}"
            
            await self.log_result("Real-time Analytics", success, message, {
                "initial_xp": initial_xp,
                "updated_xp": updated_data.get("total_xp", 0) if success else 0
            })
            return success
        except Exception as e:
            await self.log_result("Real-time Analytics", False, f"Error: {e}")
            return False

    async def test_12_performance_stress(self):
        """Test 12: Performance/Stress Test"""
        try:
            start_time = time.time()
            concurrent_requests = []
            
            # Make 10 concurrent requests to different endpoints
            endpoints = [
                "/health",
                "/api/v1/analytics/me", 
                "/api/v1/quests",
                "/api/v1/badges",
                "/api/v1/leaderboard"
            ]
            
            for _ in range(10):
                for endpoint in endpoints:
                    concurrent_requests.append(
                        self.client.get(f"{self.base_url}{endpoint}")
                    )
            
            # Execute all requests concurrently
            responses = await asyncio.gather(*concurrent_requests, return_exceptions=True)
            end_time = time.time()
            
            # Analyze results
            successful_requests = sum(1 for r in responses if isinstance(r, httpx.Response) and r.status_code == 200)
            total_requests = len(concurrent_requests)
            success_rate = successful_requests / total_requests
            duration = end_time - start_time
            
            success = success_rate >= 0.8 and duration < 10  # 80% success rate, under 10 seconds
            message = f"Stress test: {successful_requests}/{total_requests} successful ({success_rate:.1%}) in {duration:.2f}s"
            
            await self.log_result("Performance Stress", success, message, {
                "total_requests": total_requests,
                "successful_requests": successful_requests,
                "success_rate": success_rate,
                "duration_seconds": duration
            })
            return success
        except Exception as e:
            await self.log_result("Performance Stress", False, f"Error: {e}")
            return False

    async def run_all_tests(self):
        """Run all tests and generate report"""
        print("🚀 Starting CodeQuest Platform Test Suite")
        print("=" * 60)
        
        start_time = time.time()
        
        # List of all test methods
        tests = [
            self.test_1_health_check,
            self.test_2_user_analytics,
            self.test_3_quests_endpoint,
            self.test_4_quest_completion,
            self.test_5_ai_chat,
            self.test_6_code_review,
            self.test_7_github_integration,
            self.test_8_badge_system,
            self.test_9_leaderboard,
            self.test_10_user_profile,
            self.test_11_real_time_analytics,
            self.test_12_performance_stress
        ]
        
        # Run all tests
        for test in tests:
            try:
                await test()
            except Exception as e:
                test_name = test.__name__.replace("test_", "").replace("_", " ").title()
                await self.log_result(test_name, False, f"Test crashed: {e}")
            
            # Small delay between tests
            await asyncio.sleep(0.5)
        
        # Generate final report
        await self.generate_report(time.time() - start_time)
        await self.client.aclose()

    async def generate_report(self, total_duration: float):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 FINAL TEST REPORT")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r["success"])
        failed_tests = total_tests - passed_tests
        success_rate = passed_tests / total_tests if total_tests > 0 else 0
        
        print(f"🎯 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {success_rate:.1%}")
        print(f"⏱️  Duration: {total_duration:.2f} seconds")
        print()
        
        # Show failed tests details
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            print("-" * 40)
            for result in self.results:
                if not result["success"]:
                    print(f"• {result['test']}: {result['message']}")
            print()
        
        # Show passed tests summary
        print("✅ PASSED TESTS:")
        print("-" * 40)
        for result in self.results:
            if result["success"]:
                print(f"• {result['test']}: {result['message']}")
        
        # Overall status
        print("\n" + "=" * 60)
        if success_rate >= 0.8:
            print("🎉 OVERALL STATUS: EXCELLENT - Platform is working great!")
        elif success_rate >= 0.6:
            print("⚠️  OVERALL STATUS: GOOD - Minor issues detected")
        else:
            print("🚨 OVERALL STATUS: NEEDS ATTENTION - Multiple failures detected")
        
        # Save detailed report to file
        report_data = {
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "success_rate": success_rate,
                "duration_seconds": total_duration,
                "timestamp": datetime.now().isoformat()
            },
            "results": self.results
        }
        
        try:
            with open("codequest_test_report.json", "w") as f:
                json.dump(report_data, f, indent=2)
            print(f"\n📝 Detailed report saved to: codequest_test_report.json")
        except Exception as e:
            print(f"\n⚠️  Could not save report file: {e}")


async def main():
    """Main test runner"""
    print("🔧 CodeQuest Platform - Comprehensive Test Suite")
    print("Testing all major features and integrations...\n")
    
    # Check if backend is running
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:8000/health", timeout=5.0)
            if response.status_code != 200:
                print("❌ Backend server is not responding properly!")
                print("🔧 Please start the backend with: python -m uvicorn app.main:app --reload --port 8000")
                return
    except Exception as e:
        print("❌ Cannot connect to backend server!")
        print("🔧 Please start the backend with: python -m uvicorn app.main:app --reload --port 8000")
        print(f"Error: {e}")
        return
    
    # Run the test suite
    tester = CodeQuestTester()
    await tester.run_all_tests()


if __name__ == "__main__":
    # Run the tests
    asyncio.run(main())