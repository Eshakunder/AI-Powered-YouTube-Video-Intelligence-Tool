import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header, HTTPException

# 1. Dynamically locate the backend root directory
# current_dir is src/auth -> dirname is src -> dirname is backend
current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(current_dir))

# 2. Join with your underscore-style filename
service_account_path = os.path.join(BASE_DIR, "firebase_service_account.json")

# 3. Initialize Firebase ONLY ONCE with an existence check
if not firebase_admin._apps:
    if not os.path.exists(service_account_path):
        # This will print the exact path Python is trying to use
        print(f"\n❌ ERROR: Service account file not found at: {service_account_path}")
        print(f"Current working directory is: {os.getcwd()}\n")
        raise FileNotFoundError(f"Could not find {service_account_path}")
    
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"❌ Failed to initialize Firebase: {e}")
        raise e

# 🔑 Dependency function
def get_current_user(authorization: str = Header(...)):
    """
    Expects header: Authorization: Bearer <token>
    """
    try:
        # Split 'Bearer <token>'
        parts = authorization.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid Authorization header format")
            
        token = parts[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        # In production, don't return the raw error 'e', but for 
        # debugging your Master's project, it can be helpful.
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")