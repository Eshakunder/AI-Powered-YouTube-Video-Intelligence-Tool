# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# import json

# # 🔐 Internal Modules
# from src.auth.firebase_auth import get_current_user
# from src.database.mongo import MongoDBClient
# from src.pipeline.analyzer import VideoAnalysisPipeline

# router = APIRouter()

# # ✅ Initialize instances ONCE at the module level
# pipeline = VideoAnalysisPipeline()
# db = MongoDBClient()

# class AnalysisRequest(BaseModel):
#     video_id: str

# @router.post("/analyze")
# def analyze(request: AnalysisRequest, user=Depends(get_current_user)):
#     try:
#         # Extract UID from the verified Firebase token
#         user_id = user["uid"]

#         # 1. Check for existing analysis in this user's history
#         existing = db.find_by_video_id(user_id, request.video_id)
#         if existing:
#             return existing

#         # 2. Process video through your ML pipeline
#         result = pipeline.run(request.video_id)

#         if not result or (isinstance(result, dict) and "error" in result):
#             error_msg = result.get("error", "Pipeline failed") if result else "Empty result"
#             raise HTTPException(status_code=400, detail=error_msg)

#         # 3. Clean and tag data
#         result["video_id"] = request.video_id
#         # Convert non-serializable objects (like datetime) to strings
#         clean_result = json.loads(json.dumps(result, default=str))

#         # 4. Save using the 'db' instance (fixes the 400/TypeError)
#         db.save_analysis(user_id, clean_result)

#         return clean_result

#     except Exception as e:
#         print(f"❌ ANALYZE ERROR: {e}")
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/history")
# def get_history(user=Depends(get_current_user)):
#     try:
#         # returns history specific to user['uid']
#         return db.get_user_videos(user["uid"])
#     except Exception as e:
#         print(f"❌ HISTORY ERROR: {e}")
#         raise HTTPException(status_code=500, detail=str(e))





# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# import json
# import traceback
# import math

# from src.auth.firebase_auth import get_current_user
# from src.database.mongo import MongoDBClient
# from src.pipeline.analyzer import VideoAnalysisPipeline

# router = APIRouter()

# pipeline = VideoAnalysisPipeline()
# db = MongoDBClient()


# class AnalysisRequest(BaseModel):
#     video_id: str


# # ✅ ADD THIS FUNCTION (you missed it)
# def sanitize_floats(obj):
#     """Recursively replace NaN/Inf with None"""
#     if isinstance(obj, float):
#         if math.isnan(obj) or math.isinf(obj):
#             return None
#         return obj
#     elif isinstance(obj, dict):
#         return {k: sanitize_floats(v) for k, v in obj.items()}
#     elif isinstance(obj, list):
#         return [sanitize_floats(item) for item in obj]
#     return obj


# @router.post("/analyze")
# def analyze(request: AnalysisRequest, user=Depends(get_current_user)):
#     try:
#         user_id = user["uid"]

#         existing = db.find_by_video_id(user_id, request.video_id)
#         if existing:
#             # ✅ ALSO CLEAN OLD DATA HERE
#             existing = sanitize_floats(existing)
#             return json.loads(json.dumps(existing, default=str))

#         result = pipeline.run(request.video_id, user_id)

#         if not result or "error" in result:
#             raise HTTPException(status_code=400, detail=result.get("error", "Pipeline failed"))

#         # ✅ CLEAN BEFORE RETURN
#         result = sanitize_floats(result)

#         return json.loads(json.dumps(result, default=str))

#     except HTTPException:
#         raise
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/history")
# def get_history(user=Depends(get_current_user)):
#     try:
#         videos = db.get_user_videos(user["uid"])

#         # ✅ CRITICAL FIX
#         clean_videos = sanitize_floats(videos)

#         return json.loads(json.dumps(clean_videos, default=str))

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# import json
# import traceback
# import math
# from src.auth.firebase_auth import get_current_user
# from src.database.mongo import MongoDBClient
# from src.pipeline.analyzer import VideoAnalysisPipeline

# router = APIRouter()
# pipeline = VideoAnalysisPipeline()
# db = MongoDBClient()


# class AnalysisRequest(BaseModel):
#     video_id: str


# def sanitize_floats(obj):
#     """Recursively replace NaN/Inf with None"""
#     if isinstance(obj, float):
#         if math.isnan(obj) or math.isinf(obj):
#             return None
#         return obj
#     elif isinstance(obj, dict):
#         return {k: sanitize_floats(v) for k, v in obj.items()}
#     elif isinstance(obj, list):
#         return [sanitize_floats(item) for item in obj]
#     return obj


# @router.post("/analyze")
# def analyze(request: AnalysisRequest, user=Depends(get_current_user)):
#     try:
#         user_id = user["uid"]
#         existing = db.find_by_video_id(user_id, request.video_id)
#         if existing:
#             existing = sanitize_floats(existing)
#             return json.loads(json.dumps(existing, default=str))

#         result = pipeline.run(request.video_id, user_id)
#         if not result or "error" in result:
#             raise HTTPException(status_code=400, detail=result.get("error", "Pipeline failed"))

#         result = sanitize_floats(result)
#         return json.loads(json.dumps(result, default=str))

#     except HTTPException:
#         raise
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/history")
# def get_history(user=Depends(get_current_user)):
#     try:
#         videos = db.get_user_videos(user["uid"])
#         clean_videos = sanitize_floats(videos)
#         return json.loads(json.dumps(clean_videos, default=str))
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/profile")
# def get_profile(user=Depends(get_current_user)):
#     """
#     Returns aggregated profile stats for the authenticated user.
#     Combines Firebase user metadata (passed via token claims) with
#     MongoDB history to compute summary statistics.
#     """
#     try:
#         user_id = user["uid"]
#         videos = db.get_user_videos(user_id)
#         clean_videos = sanitize_floats(videos)
#         clean_videos = json.loads(json.dumps(clean_videos, default=str))

#         total_videos = len(clean_videos)

#         # Compute average video sentiment across all analyses
#         sent_scores = [
#             v["metrics"]["video_sentiment"]
#             for v in clean_videos
#             if isinstance(v.get("metrics", {}).get("video_sentiment"), (int, float))
#         ]
#         avg_sentiment = (sum(sent_scores) / len(sent_scores)) if sent_scores else None

#         # Most recent analysis timestamp
#         timestamps = [v.get("created_at") or v.get("timestamp") for v in clean_videos if v.get("created_at") or v.get("timestamp")]
#         latest_analysis = max(timestamps) if timestamps else None

#         return {
#             "uid": user_id,
#             "email": user.get("email"),
#             "display_name": user.get("name"),
#             "total_videos": total_videos,
#             "avg_video_sentiment": avg_sentiment,
#             "latest_analysis": latest_analysis,
#             "history": clean_videos,  # full history included so frontend can display it
#         }

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))





from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import json
import traceback
import math
from src.auth.firebase_auth import get_current_user
from src.database.mongo import MongoDBClient
from src.pipeline.analyzer import VideoAnalysisPipeline

router = APIRouter()
pipeline = VideoAnalysisPipeline()
db = MongoDBClient()


class AnalysisRequest(BaseModel):
    video_id: str


def sanitize_floats(obj):
    """Recursively replace NaN/Inf with None"""
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_floats(item) for item in obj]
    return obj


@router.post("/analyze")
def analyze(request: AnalysisRequest, user=Depends(get_current_user)):
    try:
        user_id = user["uid"]
        existing = db.find_by_video_id(user_id, request.video_id)
        if existing:
            # Migrate legacy "top_segments" → "top_moments" for cached documents
            # saved by the old pipeline (which used "score" instead of "virality_score")
            if "top_moments" not in existing and "top_segments" in existing:
                existing["top_moments"] = [
                    {
                        "start": float(m.get("start") or 0),
                        "end": float(m.get("end") or 0),
                        "virality_score": float(
                            m.get("virality_score") or m.get("score") or 0
                        ),
                    }
                    for m in (existing.get("top_segments") or [])
                ]
            existing = sanitize_floats(existing)
            return json.loads(json.dumps(existing, default=str))

        result = pipeline.run(request.video_id, user_id)
        if not result or "error" in result:
            raise HTTPException(status_code=400, detail=result.get("error", "Pipeline failed"))

        result = sanitize_floats(result)
        return json.loads(json.dumps(result, default=str))

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
def get_history(user=Depends(get_current_user)):
    try:
        videos = db.get_user_videos(user["uid"])
        clean_videos = sanitize_floats(videos)
        return json.loads(json.dumps(clean_videos, default=str))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile")
def get_profile(user=Depends(get_current_user)):
    """
    Returns aggregated profile stats for the authenticated user.
    Combines Firebase user metadata (passed via token claims) with
    MongoDB history to compute summary statistics.
    """
    try:
        user_id = user["uid"]
        videos = db.get_user_videos(user_id)
        clean_videos = sanitize_floats(videos)
        clean_videos = json.loads(json.dumps(clean_videos, default=str))

        total_videos = len(clean_videos)

        # Compute average video sentiment across all analyses
        sent_scores = [
            v["metrics"]["video_sentiment"]
            for v in clean_videos
            if isinstance(v.get("metrics", {}).get("video_sentiment"), (int, float))
        ]
        avg_sentiment = (sum(sent_scores) / len(sent_scores)) if sent_scores else None

        # Most recent analysis timestamp
        timestamps = [v.get("created_at") or v.get("timestamp") for v in clean_videos if v.get("created_at") or v.get("timestamp")]
        latest_analysis = max(timestamps) if timestamps else None

        return {
            "uid": user_id,
            "email": user.get("email"),
            "display_name": user.get("name"),
            "total_videos": total_videos,
            "avg_video_sentiment": avg_sentiment,
            "latest_analysis": latest_analysis,
            "history": clean_videos,  # full history included so frontend can display it
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))