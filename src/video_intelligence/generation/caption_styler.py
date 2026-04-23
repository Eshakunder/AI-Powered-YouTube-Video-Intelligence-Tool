import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")

class CaptionStyler:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_dynamic_captions(self, short_text):
        """
        Converts boring transcript text into viral-style captions.
        """
        prompt = f"""
        Rewrite this transcript snippet into 3-5 punchy, high-impact captions 
        for a vertical video. Use emojis and capitalize important words.
        
        Transcript: "{short_text}"
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Caption Generation Failed: {e}"