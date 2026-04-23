import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Path resolution to find .env at project root
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")

class HookAnalyzer:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze(self, chunked_df):
        # We only analyze the first 60 seconds (usually first 2-3 chunks)
        hook_text = " ".join(chunked_df.head(2)['clean_text'].tolist())
        
        prompt = f"""
        Analyze this video opening hook: "{hook_text}"
        1. Score it 1-10 on retention.
        2. Identify the 'Hook Type' (e.g., Question, Bold Statement, Story).
        3. Suggest a 1-sentence improvement.
        """
        try:
            return self.model.generate_content(prompt).text.strip()
        except Exception as e:
            return f"Hook Analysis Failed: {e}"