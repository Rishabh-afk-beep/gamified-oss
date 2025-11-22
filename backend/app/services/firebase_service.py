"""
Firebase Admin Service
Handles Firebase token verification and user management on the backend
"""

import json
import os
from typing import Optional, Dict, Any
import firebase_admin
from firebase_admin import auth, credentials
from app.core.config import settings

class FirebaseAdminService:
    """Firebase Admin SDK service for token verification and user management"""
    
    def __init__(self):
        self.app = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                # Option 1: Use service account key file (recommended for production)
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
                
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    self.app = firebase_admin.initialize_app(cred)
                    print("✅ Firebase Admin initialized with service account key")
                
                # Option 2: Use service account key from environment variable
                elif os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"):
                    service_account_info = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
                    cred = credentials.Certificate(service_account_info)
                    self.app = firebase_admin.initialize_app(cred)
                    print("✅ Firebase Admin initialized with service account from env")
                
                # Option 3: Use default credentials (for development)
                else:
                    # For development, you can use default credentials
                    # This will work if you have gcloud CLI set up
                    try:
                        self.app = firebase_admin.initialize_app()
                        print("✅ Firebase Admin initialized with default credentials")
                    except Exception as e:
                        print(f"⚠️ Firebase Admin initialization failed: {e}")
                        print("💡 Please set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH")
                        self.app = None
            else:
                self.app = firebase_admin.get_app()
                print("✅ Firebase Admin already initialized")
                
        except Exception as e:
            print(f"❌ Firebase Admin initialization error: {e}")
            self.app = None
    
    async def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Firebase ID token and return user information
        
        Args:
            id_token: Firebase ID token from frontend
            
        Returns:
            User information if token is valid, None otherwise
        """
        if not self.app:
            raise Exception("Firebase Admin not initialized")
        
        try:
            # Verify the ID token
            decoded_token = auth.verify_id_token(id_token)
            
            user_info = {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'email_verified': decoded_token.get('email_verified', False),
                'name': decoded_token.get('name'),
                'picture': decoded_token.get('picture'),
                'firebase_claims': decoded_token
            }
            
            print(f"✅ Token verified for user: {user_info['email']}")
            return user_info
            
        except auth.InvalidIdTokenError:
            print("❌ Invalid ID token")
            return None
        except auth.ExpiredIdTokenError:
            print("❌ Expired ID token")
            return None
        except Exception as e:
            print(f"❌ Token verification error: {e}")
            return None
    
    async def get_user_by_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get Firebase user information by UID
        
        Args:
            uid: Firebase user UID
            
        Returns:
            User information if found, None otherwise
        """
        if not self.app:
            raise Exception("Firebase Admin not initialized")
        
        try:
            user_record = auth.get_user(uid)
            
            return {
                'uid': user_record.uid,
                'email': user_record.email,
                'email_verified': user_record.email_verified,
                'display_name': user_record.display_name,
                'photo_url': user_record.photo_url,
                'disabled': user_record.disabled,
                'creation_timestamp': user_record.user_metadata.creation_timestamp,
                'last_sign_in_timestamp': user_record.user_metadata.last_sign_in_timestamp,
            }
            
        except auth.UserNotFoundError:
            print(f"❌ User not found: {uid}")
            return None
        except Exception as e:
            print(f"❌ Error getting user: {e}")
            return None
    
    async def create_custom_token(self, uid: str, additional_claims: Optional[Dict] = None) -> Optional[str]:
        """
        Create a custom token for a user
        
        Args:
            uid: Firebase user UID
            additional_claims: Additional claims to include in token
            
        Returns:
            Custom token if successful, None otherwise
        """
        if not self.app:
            raise Exception("Firebase Admin not initialized")
        
        try:
            custom_token = auth.create_custom_token(uid, additional_claims)
            return custom_token.decode('utf-8')
        except Exception as e:
            print(f"❌ Error creating custom token: {e}")
            return None
    
    async def set_custom_user_claims(self, uid: str, custom_claims: Dict[str, Any]) -> bool:
        """
        Set custom claims for a user (for role-based access)
        
        Args:
            uid: Firebase user UID
            custom_claims: Custom claims to set
            
        Returns:
            True if successful, False otherwise
        """
        if not self.app:
            raise Exception("Firebase Admin not initialized")
        
        try:
            auth.set_custom_user_claims(uid, custom_claims)
            print(f"✅ Custom claims set for user: {uid}")
            return True
        except Exception as e:
            print(f"❌ Error setting custom claims: {e}")
            return False

# Global instance
firebase_admin_service = FirebaseAdminService()