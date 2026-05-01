from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# ✅ Import the pipeline class (NOT old function)
from src.pipeline.analyzer import VideoAnalysisPipeline

app = FastAPI(title="YouTube Intelligence API")

# ✅ Initialize ONCE (important for performance)
pipeline = VideoAnalysisPipeline()


class AnalysisRequest(BaseModel):
    video_id: str


@app.get("/")
def health_check():
    return {
        "status": "online",
        "message": "Ready to analyze videos"
    }


@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    try:
        result = pipeline.run(request.video_id)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)