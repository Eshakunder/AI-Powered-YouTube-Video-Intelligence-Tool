from google import genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")


class ContradictionAnalyzer:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("❌ GEMINI_API_KEY missing")

        self.client = genai.Client(api_key=api_key)

    def analyze(self, video_summary, comments_summary,
                video_sentiment, comments_sentiment):

        # 🔥 Compute difference HERE
        sentiment_gap = video_sentiment - comments_sentiment

        prompt = f"""
        You are analyzing a YouTube video and audience reaction.

        VIDEO SUMMARY:
        {video_summary}

        COMMENTS SUMMARY:
        {comments_summary}

        VIDEO SENTIMENT SCORE: {video_sentiment}
        AUDIENCE SENTIMENT SCORE: {comments_sentiment}

        SENTIMENT DIFFERENCE: {sentiment_gap}

        Task:
        1. Say if audience agrees or disagrees with the video.
        2. Explain WHY (based on summaries).
        3. Mention if the difference is strong or weak.

        Keep answer short (2-3 lines).
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",  # better reasoning
                contents=prompt
            )
            return response.text.strip()

        except Exception as e:
            return f"Error: {e}"