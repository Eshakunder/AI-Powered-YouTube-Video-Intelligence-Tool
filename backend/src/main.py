# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import uvicorn

# # ✅ Import the pipeline class
# from src.pipeline.analyzer import VideoAnalysisPipeline

# app = FastAPI(title="YouTube Intelligence API")

# # ✅ Initialize ONCE at startup to load ML models into memory
# pipeline = VideoAnalysisPipeline()


# class AnalysisRequest(BaseModel):
#     video_id: str


# @app.get("/")
# def health_check():
#     return {
#         "status": "online",
#         "message": "Ready to analyze videos"
#     }


# @app.post("/analyze")
# def analyze(request: AnalysisRequest):
#     """
#     Endpoint to trigger the full analysis pipeline.
#     Defined as 'def' (sync) because the pipeline uses synchronous pymongo 
#     and heavy CPU-bound processing.
#     """
#     try:
#         # No 'await' needed here for the pymongo version
#         result = pipeline.run(request.video_id)
        
#         # Check if the pipeline returned an internal error dictionary
#         if isinstance(result, dict) and "error" in result:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#         return result

#     except Exception as e:
#         # Catch any unexpected system crashes
#         raise HTTPException(status_code=500, detail=str(e))


# if __name__ == "__main__":
#     # Ensure you run this from the /backend directory level
#     uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.routes.video_routes import router as video_router

app = FastAPI(title="YouTube Intelligence API")

# ✅ CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes
app.include_router(video_router)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "message": "Ready to analyze videos"
    }


if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)