# 🎮 CodeQuest - Gamified Open Source Learning Platform

<div align="center">

![CodeQuest Logo](https://img.shields.io/badge/CodeQuest-🎯_Learn_•_Code_•_Contribute-blueviolet?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

**Transform your coding journey into an epic adventure!**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](backend/)
[![Frontend](https://img.shields.io/badge/Frontend-React+Vite-61DAFB?logo=react)](frontend/)
[![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://mongodb.com)

[🚀 Live Demo](https://codequest.example.com) • [📖 Documentation](https://github.com/Rishabh-afk-beep/gamified-oss/wiki) • [🎯 Features](#-features) • [⚡ Quick Start](#-quick-start)

</div>

---

## 🌟 What is CodeQuest?

CodeQuest is a **revolutionary gamified platform** that transforms learning to code and contributing to open-source into an exciting RPG-style adventure. Level up your skills, earn XP, collect badges, and become a coding hero! 🦸‍♂️

### 🎯 The Learning Journey

```
🎓 Onboarding → 📚 Tutorial Quests → 🔗 GitHub Integration → 🚀 Real Issue Solving → 🤖 AI Code Review → 🏆 Master Developer
```

---

## ✨ Features

### 🎮 **Gamification Core**
- 🏅 **XP & Level System** - Earn experience points and level up
- 🎖️ **Badge Collection** - Unlock achievements for milestones
- 🔥 **Streak Tracking** - Maintain coding streaks for bonus rewards
- 🏆 **Leaderboards** - Compete with the global community
- ⭐ **Quest System** - Progressive challenges from beginner to expert

### 🤖 **AI-Powered Learning**
- 🔍 **Smart Code Review** - Real-time analysis with Gemini AI
- 💡 **Intelligent Hints** - Context-aware suggestions
- 🎯 **Personalized Learning** - Adaptive difficulty based on your progress
- 📊 **Code Quality Scoring** - Detailed metrics and improvements
- 🗣️ **AI Tutor Chat** - Get help anytime with coding questions

### 🚀 **GitHub Integration**
- 🔎 **Good First Issues Finder** - Discover beginner-friendly projects
- 📈 **Contribution Tracking** - Monitor your open-source impact
- 🔄 **Real Issue Practice** - Work on actual GitHub issues
- 👥 **Community Connection** - Connect with maintainers and contributors

### 📊 **Analytics & Progress**
- 📈 **Real-time Dashboard** - Live progress tracking
- 🎯 **Skill Assessment** - Identify strengths and areas for growth
- ⏰ **Time Management** - Track coding sessions and productivity
- 📋 **Goal Setting** - Set and achieve personalized objectives

### 🛠️ **Development Tools**
- 💻 **Monaco Code Editor** - VS Code-quality editing experience
- 🌈 **Multi-language Support** - JavaScript, Python, Java, C++, and more
- 🔧 **Instant Feedback** - Real-time code validation
- 📱 **Responsive Design** - Learn on any device

---

## 🚀 Quick Start

### 📋 Prerequisites

```bash
📦 Node.js 16+ 
🐍 Python 3.8+
🍃 MongoDB (local or Atlas)
🔧 Git
```

### ⚡ Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Rishabh-afk-beep/gamified-oss.git
cd gamified-oss

# 2️⃣ Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3️⃣ Frontend setup  
cd ../frontend
npm install

# 4️⃣ Environment setup (see below)
```

### 🔐 Environment Configuration

Create `.env.local` files:

**🔧 Backend Configuration (`backend/.env.local`):**
```env
# 🤖 AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# 🗄️ Database
MONGODB_URL=mongodb://localhost:27017/codequest

# 🔐 Authentication
SECRET_KEY=your-super-secret-jwt-key-min-32-chars
FIREBASE_SERVICE_ACCOUNT_KEY=firebase_service_account_json

# 🐙 GitHub Integration
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret

# ⚙️ Server Configuration
PORT=8000
DEBUG=true
ENVIRONMENT=development
```

**⚛️ Frontend Configuration (`frontend/.env.local`):**
```env
# 🌐 API Configuration
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=CodeQuest

# 🔥 Firebase Configuration
VITE_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"..."}
```

### 🏃‍♂️ Running the Application

```bash
# 🎯 Terminal 1: Start Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# 🎯 Terminal 2: Start Frontend  
cd frontend
npm run dev

# 🎉 Open http://localhost:5174 in your browser!
```

---

## 🏗️ Architecture

### 🎯 **System Overview**

```mermaid
graph TB
    A[React Frontend] --> B[FastAPI Backend]
    B --> C[MongoDB Database]
    B --> D[Google Gemini AI]
    B --> E[GitHub API]
    B --> F[Firebase Auth]
    
    G[User] --> A
    A --> H[Monaco Editor]
    A --> I[Real-time Analytics]
    A --> J[Gamification UI]
```

### 📁 **Project Structure**

```
🎮 CodeQuest/
├── 🔧 backend/                    # FastAPI Python Backend
│   ├── 📡 app/api/v1/             # REST API Endpoints
│   ├── ⚙️ app/core/               # Configuration & Database
│   ├── 📊 app/models/             # Data Models (Pydantic)
│   ├── 🎯 app/services/           # Business Logic Layer
│   ├── 📋 app/schemas/            # API Schemas
│   ├── 🛠️ app/utils/              # Utility Functions
│   ├── 🧪 tests/                  # Comprehensive Test Suite
│   └── 📜 requirements.txt        # Python Dependencies
├── ⚛️ frontend/                   # React Vite Frontend
│   ├── 🧩 src/components/         # Reusable UI Components
│   ├── 📄 src/pages/              # Route Components
│   ├── 🔌 src/services/           # API Integration
│   ├── 🎛️ src/context/            # State Management
│   ├── 🎨 src/styles/             # Styling & Themes
│   └── 📦 package.json            # Node.js Dependencies
├── 🤖 github-bot/                 # GitHub Integration Bot
├── 🐳 docker-compose.yml          # Development Environment
├── 📝 .gitignore                  # Version Control Rules
└── 📖 README.md                   # This file!
```

---

## 🎯 Core Features Deep Dive

### 🎮 **Gamification Engine**

```python
# XP Calculation System
XP_REWARDS = {
    "quest_easy": 50,      # Beginner quests
    "quest_medium": 100,   # Intermediate quests  
    "quest_hard": 200,     # Advanced quests
    "github_issue": 150,   # Open-source contributions
    "code_review": 75,     # Peer code reviews
    "daily_streak": 25     # Daily coding streak bonus
}

# Level Progression: Every 1000 XP = 1 Level
level = total_xp // 1000 + 1
```

### 🤖 **AI Code Analysis**

The platform uses **Google Gemini 2.0 Flash** for intelligent code review:

- **📊 Quality Scoring**: 0-10 scale with detailed metrics
- **🔍 Smart Suggestions**: Context-aware improvements
- **🐛 Bug Detection**: Identify potential issues
- **⚡ Performance Tips**: Optimization recommendations
- **📚 Learning Context**: Educational explanations

### 🚀 **GitHub Integration Workflow**

```javascript
// Good First Issues Discovery
const discoverIssues = async (language, difficulty) => {
  const issues = await githubAPI.searchIssues({
    labels: ["good first issue", "beginner friendly"],
    language: language,
    state: "open",
    sort: "updated"
  });
  
  return issues.filter(issue => 
    issue.difficulty <= difficulty &&
    issue.mentorAvailable
  );
};
```

---

## 🛠️ API Documentation

### 🌐 **Interactive Documentation**

Once the backend is running:

- **🎯 Swagger UI**: http://localhost:8000/docs
- **📚 ReDoc**: http://localhost:8000/redoc  
- **🔧 OpenAPI JSON**: http://localhost:8000/openapi.json

### 🔗 **Key Endpoints**

```bash
# 🎮 Gamification
GET  /api/v1/quests              # Available quests
POST /api/v1/quests/complete     # Complete a quest
GET  /api/v1/badges              # User badges
GET  /api/v1/leaderboard         # Global rankings

# 🤖 AI Features  
POST /api/v1/ai/chat             # Chat with AI tutor
POST /api/v1/ai/review-code      # Code analysis
POST /api/v1/ai/hint             # Get coding hints

# 🚀 GitHub Integration
GET  /api/v1/github/issues       # Good first issues
POST /api/v1/github/track        # Track contribution

# 📊 Analytics
GET  /api/v1/analytics/me        # Personal progress
GET  /api/v1/analytics/real-time # Live updates
```

---

## 🧪 Testing

### ✅ **Comprehensive Test Suite**

```bash
# 🐍 Backend Testing
cd backend
pytest                           # Full test suite
python test_complete_platform.py # Integration tests
python -m pytest tests/ -v      # Verbose unit tests

# ⚛️ Frontend Testing
cd frontend
npm test                         # Jest unit tests
npm run test:e2e                 # End-to-end tests
npm run test:coverage            # Coverage report
```

### 📊 **Test Coverage Goals**

- 🎯 **Backend**: >90% code coverage
- ⚛️ **Frontend**: >85% component coverage
- 🔗 **API**: 100% endpoint testing
- 🤖 **AI Integration**: Full feature testing

---

## 🐳 Docker Development

### 🚀 **One-Command Setup**

```bash
# Start everything with Docker
docker-compose up -d

# View real-time logs
docker-compose logs -f backend frontend

# Stop all services
docker-compose down

# Reset everything (careful!)
docker-compose down -v && docker-compose up -d
```

### 📦 **Services**

- **🔧 Backend**: http://localhost:8000
- **⚛️ Frontend**: http://localhost:5174
- **🗄️ MongoDB**: mongodb://localhost:27017
- **📊 Mongo Express**: http://localhost:8081

---

## 🔑 Environment Setup Guide

### 1️⃣ **Google Gemini AI Setup**

```bash
# Get your API key from Google AI Studio
🌐 Visit: https://makersuite.google.com/
🔑 Create project → Generate API key
📝 Add to backend/.env.local: GEMINI_API_KEY=your_key_here
```

### 2️⃣ **GitHub Integration Setup**

```bash
# Personal Access Token
🌐 GitHub → Settings → Developer settings → Personal access tokens
🔐 Generate token with scopes: repo, read:org, read:user
📝 Add to backend/.env.local: GITHUB_TOKEN=ghp_your_token_here

# OAuth App (optional, for advanced features)
🌐 GitHub → Settings → Developer settings → OAuth Apps
📝 Add client ID/secret to .env.local
```

### 3️⃣ **Firebase Authentication Setup**

```bash
# Firebase Console Setup
🌐 Visit: https://console.firebase.google.com/
🆕 Create new project
🔐 Authentication → Enable Email/Password + Google
🔧 Project settings → Service accounts → Generate new private key
📁 Download JSON and add to backend/.env.local
```

### 4️⃣ **MongoDB Setup**

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
🍎 macOS: brew tap mongodb/brew && brew install mongodb-community
🐧 Ubuntu: sudo apt-get install mongodb
🪟 Windows: Download from https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /your/db/path
```

**Option B: MongoDB Atlas (Cloud)**
```bash
🌐 Visit: https://www.mongodb.com/cloud/atlas
🆕 Create free cluster
🔗 Get connection string
📝 Add to backend/.env.local: MONGODB_URL=mongodb+srv://...
```

---

## 🐛 Troubleshooting

### 🔧 **Common Issues & Solutions**

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.8+

# Verify virtual environment
which python  # Should point to venv/bin/python

# Check environment variables
python -c "from app.core.config import settings; print('✅ Config loaded')"
```

**Frontend build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+

# Verify environment
npm run build  # Check for build errors
```

**AI features not working:**
```bash
# Test Gemini connection
python -c "from app.services.ai_service import AIService; print('AI Service OK')"

# Check API quota
🌐 Visit: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
```

**Database connection issues:**
```bash
# Test MongoDB connection
python -c "from motor.motor_asyncio import AsyncIOMotorClient; print('MongoDB OK')"

# Check connection string format
# mongodb://localhost:27017/codequest  (local)
# mongodb+srv://user:pass@cluster.xyz.mongodb.net/codequest  (Atlas)
```

### 📞 **Getting Help**

- 📖 **Documentation**: [Wiki](https://github.com/Rishabh-afk-beep/gamified-oss/wiki)
- 🐛 **Bug Reports**: [Issues](https://github.com/Rishabh-afk-beep/gamified-oss/issues)
- 💬 **Community**: [Discussions](https://github.com/Rishabh-afk-beep/gamified-oss/discussions)
- 📧 **Direct Contact**: rishav.developer@gmail.com

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! 🎉

### 🚀 **Quick Contribution Guide**

```bash
# 1️⃣ Fork & Clone
git clone https://github.com/YOUR_USERNAME/gamified-oss.git
cd gamified-oss

# 2️⃣ Create Feature Branch
git checkout -b feature/amazing-new-feature

# 3️⃣ Make Your Changes
# Add your awesome code here! 

# 4️⃣ Test Everything
cd backend && pytest
cd frontend && npm test

# 5️⃣ Commit & Push
git add .
git commit -m "✨ Add amazing new feature"
git push origin feature/amazing-new-feature

# 6️⃣ Create Pull Request
# Go to GitHub and create a PR with a great description!
```

### 🎯 **Ways to Contribute**

- 🐛 **Bug Fixes**: Help squash those pesky bugs
- ✨ **New Features**: Add exciting new functionality
- 📚 **Documentation**: Improve guides and tutorials
- 🎨 **UI/UX**: Enhance the user experience
- 🧪 **Testing**: Add more comprehensive tests
- 🌐 **Localization**: Add support for more languages
- 🤖 **AI Improvements**: Enhance the AI tutoring system

### 📋 **Development Guidelines**

**Code Style:**
```bash
# Python (Backend)
black app/              # Format code
isort app/             # Sort imports
flake8 app/            # Lint code

# JavaScript (Frontend)
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix issues
npm run format         # Prettier formatting
```

**Commit Messages:**
```bash
✨ feat: add new gamification feature
🐛 fix: resolve AI service connection issue
📚 docs: update API documentation
🎨 style: improve dashboard UI components
🔧 refactor: optimize quest service performance
🧪 test: add comprehensive API tests
```

---

## 📊 Performance & Scalability

### ⚡ **Performance Metrics**

- **🚀 API Response Time**: <200ms average
- **💻 Frontend Bundle Size**: <500KB gzipped
- **🎮 Real-time Updates**: <100ms latency
- **🤖 AI Response Time**: <2s for code analysis
- **📊 Database Queries**: <50ms average

### 📈 **Scalability Features**

- **🔄 Async Operations**: Full async/await pattern
- **📦 Caching**: Redis for session and API caching
- **🗄️ Database Indexing**: Optimized MongoDB queries
- **🌐 CDN Ready**: Static asset optimization
- **🐳 Container Ready**: Docker for easy deployment

---

## 🚀 Deployment

### ☁️ **Production Deployment**

**Environment Setup:**
```bash
# Production environment variables
ENVIRONMENT=production
DEBUG=false
MONGODB_URL=mongodb+srv://prod-cluster...
GEMINI_API_KEY=prod-api-key
# ... other production configs
```

**Docker Production:**
```bash
# Build production images
docker build -t codequest-backend ./backend
docker build -t codequest-frontend ./frontend

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

**Cloud Deployment Options:**
- 🌊 **Vercel/Netlify**: Frontend hosting
- 🚀 **Railway/Heroku**: Full-stack deployment
- ☁️ **AWS/GCP/Azure**: Enterprise deployment
- 🐳 **Kubernetes**: Container orchestration

---

## 🏆 Achievements & Roadmap

### ✅ **Current Features**

- ✅ Complete gamification system
- ✅ AI-powered code review
- ✅ GitHub integration
- ✅ Real-time analytics
- ✅ Monaco code editor
- ✅ Comprehensive testing
- ✅ Docker development environment

### 🚀 **Upcoming Features**

- 🎯 **Q1 2026**: Mobile app (React Native)
- 🤖 **Q2 2026**: Advanced AI tutoring with voice
- 🌐 **Q3 2026**: Multi-language support
- 👥 **Q4 2026**: Social features and team challenges
- 🎮 **2027**: VR coding environments

### 📈 **Community Goals**

- 🎯 **1K** active users
- 🏆 **500** GitHub contributions tracked
- 🤝 **100** open-source projects integrated
- 🌟 **1K** GitHub stars

---

## 🎉 Community

### 🌟 **Join the CodeQuest Community**

- 🐙 **GitHub**: [Rishabh-afk-beep/gamified-oss](https://github.com/Rishabh-afk-beep/gamified-oss)
- 💬 **Discord**: [Join our server](https://discord.gg/codequest)
- 🐦 **Twitter**: [@CodeQuestDev](https://twitter.com/codequestdev)
- 📧 **Email**: community@codequest.dev

### 🏅 **Top Contributors**

Thanks to these amazing developers who make CodeQuest possible:

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=Rishabh-afk-beep/gamified-oss)](https://github.com/Rishabh-afk-beep/gamified-oss/graphs/contributors)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use this project for learning, personal, or commercial use!
```

---

## 🙏 Acknowledgments

### 💝 **Special Thanks**

- 🤖 **Google Gemini Team** - For powerful AI capabilities
- 🐙 **GitHub** - For open-source integration APIs
- 🔥 **Firebase Team** - For authentication infrastructure  
- 🍃 **MongoDB** - For flexible data storage
- ⚛️ **React & Vite Teams** - For amazing development experience
- 🐍 **FastAPI Team** - For the fastest Python framework
- 🎨 **Tailwind CSS** - For beautiful, responsive design
- 🌟 **Open Source Community** - For inspiration and contributions

### 🎯 **Inspiration**

CodeQuest was inspired by:
- 🎮 **Gaming RPGs** - Progression systems and achievements
- 📚 **Educational Platforms** - Structured learning paths
- 🚀 **Open Source Culture** - Community collaboration
- 🤖 **AI Revolution** - Intelligent tutoring systems

---

<div align="center">

## 🚀 Ready to Start Your Coding Quest?

**[🎮 Get Started Now](https://github.com/Rishabh-afk-beep/gamified-oss#-quick-start)** • **[📖 Read the Docs](https://github.com/Rishabh-afk-beep/gamified-oss/wiki)** • **[🤝 Join Community](https://discord.gg/codequest)**

---

### Made with ❤️ by [@Rishabh-afk-beep](https://github.com/Rishabh-afk-beep)

**⭐ Star this repo if you found it helpful! ⭐**

*Transform your coding journey into an epic adventure with CodeQuest!* 🎯✨

</div>
