# from google import genai
# import os
# from dotenv import load_dotenv
# from pathlib import Path


# # Load .env
# base_dir = Path(__file__).resolve().parent.parent.parent.parent
# load_dotenv(base_dir / ".env")


# class VideoInsightsAnalyzer:
#     def __init__(self):
#         api_key = os.getenv("GEMINI_API_KEY")

#         if not api_key:
#             raise ValueError("❌ GEMINI_API_KEY missing")

#         self.client = genai.Client(api_key=api_key)

#     def analyze(self, chunked_df, comments_df,
#                 video_sentiment, comments_sentiment):

#         # -----------------------------
#         # Prepare inputs
#         # -----------------------------
#         video_text = (
#             chunked_df['clean_text'].head(15).str.cat(sep=' ')
#             if not chunked_df.empty else "No transcript available."
#         )

#         comments_text = (
#             comments_df.sort_values(by='like_count', ascending=False)['clean_text']
#             .head(30).str.cat(sep=' ')
#             if not comments_df.empty else "No comments available."
#         )

#         sentiment_gap = video_sentiment - comments_sentiment

#         # -----------------------------
#         # Single Prompt
#         # -----------------------------
#         prompt = f"""
#         You are analyzing a YouTube video and its audience reaction.

#         ----------------------
#         VIDEO TRANSCRIPT:
#         {video_text}

#         COMMENTS:
#         {comments_text}

#         ----------------------
#         VIDEO SENTIMENT: {video_sentiment}
#         AUDIENCE SENTIMENT: {comments_sentiment}
#         SENTIMENT GAP: {sentiment_gap}

#         ----------------------
#         TASKS:

#         1. Summarize the VIDEO in 3 bullet points.
#         2. Summarize AUDIENCE REACTION in 3 bullet points.
#         3. Determine if audience AGREES or DISAGREES with the video.
#         4. Explain WHY (based on both summaries).
#         5. Say if sentiment difference is STRONG or WEAK.

#         Keep output concise and structured.
#         """

#         try:
#             response = self.client.models.generate_content(
#                 model="gemini-2.5-flash",
#                 contents=prompt
#             )
#             return response.text.strip()

#         except Exception as e:
#             return f"Error: {e}"



import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai


# -----------------------------
# Load .env
# -----------------------------
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")


class VideoInsightsAnalyzer:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("❌ GEMINI_API_KEY missing")

        self.client = genai.Client(api_key=api_key)

    def analyze(self, chunked_df, comments_df,
                video_sentiment, comments_sentiment):

        # -----------------------------
        # Prepare inputs (safe slicing)
        # -----------------------------
        video_text = (
            chunked_df['clean_text'].head(15).astype(str).str.cat(sep=' ')
            if not chunked_df.empty else "No transcript available."
        )

        comments_text = (
            comments_df.sort_values(by='like_count', ascending=False)['clean_text']
            .head(30).astype(str).str.cat(sep=' ')
            if not comments_df.empty else "No comments available."
        )

        sentiment_gap = float(video_sentiment - comments_sentiment)

        # -----------------------------
        # STRICT JSON PROMPT
        # -----------------------------
        prompt = f"""
You are an AI video analyst.

Return ONLY valid JSON. No explanations. No markdown.

Format:
{{
  "video_summary": ["point1", "point2", "point3"],
  "audience_reaction": ["point1", "point2", "point3"],
  "agreement": "AGREE or DISAGREE",
  "reason": "short explanation",
  "sentiment_strength": "STRONG or WEAK"
}}

DATA:
Video Sentiment: {video_sentiment}
Audience Sentiment: {comments_sentiment}
Sentiment Gap: {sentiment_gap}

TRANSCRIPT:
{video_text}

COMMENTS:
{comments_text}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt
            )

            # -----------------------------
            # Handle EMPTY response
            # -----------------------------
            if not response or not hasattr(response, "text") or not response.text:
                return {
                    "error": "Empty LLM response"
                }

            raw = response.text.strip()

            # -----------------------------
            # DEBUG (optional - remove later)
            # -----------------------------
            print("\n🔍 RAW LLM OUTPUT:\n", raw[:500])

            # -----------------------------
            # Try parsing JSON
            # -----------------------------
            try:
                parsed = json.loads(raw)
                return parsed

            except json.JSONDecodeError:
                # fallback: return raw output safely
                return {
                    "error": "Invalid JSON from LLM",
                    "raw_output": raw
                }

        except Exception as e:
            return {
                "error": f"LLM Exception: {str(e)}"
            }