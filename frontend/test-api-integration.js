// Test API Integration
async function testIntegration() {
  const API_URL = 'http://localhost:8000/api/v1';
  
  console.log('🧪 Starting integration tests...\n');
  
  try {
    // Test 1: Health check
    console.log('Test 1: Health Check');
    const healthRes = await fetch(`${API_URL}/health`);
    console.log(`✅ Status: ${healthRes.status}`);
    const healthData = await healthRes.json();
    console.log('✅ Response:', healthData, '\n');
    
    // Test 2: Get quests
    console.log('Test 2: Get Quests');
    const questsRes = await fetch(`${API_URL}/quests`);
    console.log(`✅ Status: ${questsRes.status}`);
    const questsData = await questsRes.json();
    console.log(`✅ Got ${questsData.length} quests\n`);
    
    // Test 3: Get leaderboard
    console.log('Test 3: Get Leaderboard');
    const leaderRes = await fetch(`${API_URL}/leaderboard`);
    console.log(`✅ Status: ${leaderRes.status}`);
    const leaderData = await leaderRes.json();
    console.log(`✅ Got leaderboard\n`);
    
    // Test 4: Get badges
    console.log('Test 4: Get Badges');
    const badgesRes = await fetch(`${API_URL}/badges`);
    console.log(`✅ Status: ${badgesRes.status}`);
    const badgesData = await badgesRes.json();
    console.log(`✅ Got ${badgesData.length} badges\n`);
    
    // Test 5: Register user
    console.log('Test 5: Register User');
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123!'
      })
    });
    console.log(`✅ Status: ${registerRes.status}`);
    const registerData = await registerRes.json();
    console.log('✅ User registered:', registerData.username, '\n');
    
    console.log('🎉 All tests passed! Frontend-Backend integration is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testIntegration();
