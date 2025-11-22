# Firebase Authentication Setup Guide

## 🔥 Firebase Project Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "codequest-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**
   - Click on Email/Password
   - Toggle "Enable" 
   - Click Save
5. Optional: Enable other providers (Google, GitHub, etc.)

### 3. Get Firebase Configuration

#### For Frontend (Web App):
1. In Project Overview, click "Add app" → Web icon
2. Register your app (App nickname: "CodeQuest Web")
3. Copy the config object:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

#### For Backend (Service Account):
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Save it securely (DO NOT commit to git)

## 🛠 Backend Configuration

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in:

```bash
# Option 1: Service Account Key File (Recommended)
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/service-account-key.json

# Option 2: Service Account as JSON String
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'

# Firebase Project Info
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

### 2. Install Dependencies
```bash
cd backend
pip install firebase-admin
```

### 3. Test Firebase Connection
Run the backend and check logs for:
```
✅ Firebase Admin initialized with service account key
```

## 🎨 Frontend Configuration

### 1. Install Firebase SDK
```bash
cd frontend
npm install firebase
```

### 2. Update Environment Variables
Create `frontend/.env.local`:
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Config File
Update `src/services/firebase.js` with your config.

## 🔐 Security Setup

### 1. Firebase Security Rules
In Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. CORS Configuration
Add your domain to CORS origins in backend config.

### 3. Environment Security
- Never commit `.env.local` files
- Use strong, unique keys for production
- Rotate service account keys regularly

## 🚀 Testing Authentication Flow

### 1. Test Registration
```bash
curl -X POST http://localhost:8000/api/v1/auth/firebase/register \
  -H "Content-Type: application/json" \
  -d '{"id_token": "firebase-id-token"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/firebase/login \
  -H "Content-Type: application/json" \
  -d '{"id_token": "firebase-id-token"}'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer firebase-id-token"
```

## 📱 Frontend Integration

### 1. Login Flow
1. User enters email/password
2. Firebase authenticates user
3. Get ID token from Firebase
4. Send token to backend `/auth/firebase/login`
5. Backend verifies token and returns user data
6. Store user data in AuthContext

### 2. Logout Flow
1. Call Firebase `signOut()`
2. Clear AuthContext
3. Redirect to login page

### 3. Protected Routes
1. Check if user is authenticated in AuthContext
2. Include Firebase ID token in API requests
3. Backend verifies token on each request

## 🔧 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"** - Check service account path/key
2. **"Invalid token"** - Ensure frontend sends valid Firebase ID token
3. **CORS errors** - Add frontend URL to CORS origins
4. **Import errors** - Ensure firebase-admin is installed

### Debug Logs:
- Backend: Check terminal for Firebase initialization messages
- Frontend: Check browser console for Firebase errors
- Network: Check API requests include Authorization header

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

## 🎯 Next Steps

1. ✅ Firebase project created
2. ✅ Backend Firebase service implemented  
3. ✅ Frontend Firebase auth components created
4. ✅ Authentication middleware implemented
5. 🔄 Test complete auth flow
6. 📝 Add user management features
7. 🔐 Implement role-based access control