import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path


# Load .env from project root
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")


class SummaryGenerator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in .env")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3.1-flash-lite-preview')

    # ----------------------------------
    # 🎬 VIDEO SUMMARY
    # ----------------------------------
    def summarize_video(self, chunked_df):
        """
        Uses first N chunks to summarize the video content
        """
        if chunked_df.empty:
            return "No video content available."

        # Take first few chunks to avoid token overflow
        text = chunked_df['clean_text'].head(15).str.cat(sep=' ')

        prompt = f"""
        Summarize the following video transcript into 3-4 concise bullet points.
        Focus on key ideas, not filler.

        Transcript:
        {text}
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Video summary error: {e}"

    # ----------------------------------
    # 💬 COMMENTS SUMMARY
    # ----------------------------------
    def summarize_comments(self, comments_df):
        """
        Summarizes audience opinion from comments
        """
        if comments_df.empty:
            return "No comments available."

        # Prefer top-liked comments if available
        comments_df = comments_df.sort_values(by='like_count', ascending=False)

        text = comments_df['clean_text'].head(30).str.cat(sep=' ')

        prompt = f"""
        Summarize the audience reaction to this video based on comments.

        Identify:
        - Overall sentiment (positive/negative/mixed)
        - Common opinions or themes
        - Any complaints or praise

        Comments:
        {text}
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Comments summary error: {e}"