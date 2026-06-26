# import os
# import certifi
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from datetime import datetime, timezone

# # Load variables from .env
# load_dotenv()

# # Get the path to the certificate bundle for macOS
# ca = certifi.where()

# class MongoDBClient:
#     def __init__(self):
#         # 🛡️ Fetch from environment variable instead of hardcoding
#         self.uri = os.getenv("MONGO_URI")
        
#         if not self.uri:
#             raise ValueError("MONGO_URI not found in .env file")
        
#         # Initialize the synchronous client
#         self.client = MongoClient(self.uri, tlsCAFile=ca)
#         self.db = self.client["youtube_intelligence"]
#         self.analysis_collection = self.db["video_analysis"]

#     def save_analysis(self, data: dict):
#         try:
#             data["created_at"] = datetime.now(timezone.utc)
#             # Synchronous insert (no await)
#             result = self.analysis_collection.insert_one(data)
#             return str(result.inserted_id)
#         except Exception as e:
#             print("Atlas Connection Error:", e)
#             return None

#     def find_by_video_id(self, video_id: str):
#         # Synchronous find (no await)
#         return self.analysis_collection.find_one({"video_id": video_id})
    


import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timezone

load_dotenv()
ca = certifi.where()

class MongoDBClient:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI")
        if not self.uri:
            raise ValueError("MONGO_URI not found in .env file")

        self.client = MongoClient(self.uri, tlsCAFile=ca)
        self.db = self.client["youtube_intelligence"]
        self.analysis_collection = self.db["video_analysis"]

    def save_analysis(self, user_id: str, data: dict):
        """Saves analysis data tagged with a specific Firebase user ID."""
        try:
            # Tag the document with the owner's ID
            data["user_id"] = user_id
            data["created_at"] = datetime.now(timezone.utc)
            
            result = self.analysis_collection.insert_one(data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"❌ Atlas Save Error: {e}")
            return None

    def find_by_video_id(self, user_id: str, video_id: str):
        """Retrieves a cached analysis ONLY if it belongs to the current user."""
        result = self.analysis_collection.find_one({
            "user_id": user_id,
            "video_id": video_id
        })
        if result:
            result["_id"] = str(result["_id"])
        return result

    def get_user_videos(self, user_id: str):
        """Fetches the history for the logged-in user, sorted by most recent."""
        videos = list(
            self.analysis_collection
            .find({"user_id": user_id})
            .sort("created_at", -1)
        )
        # Convert ObjectId to string for JSON compatibility
        for v in videos:
            v["_id"] = str(v["_id"])
        return videos