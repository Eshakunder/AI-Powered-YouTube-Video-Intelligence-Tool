# To integrate an LLM effectively into comments_sentiment.py, we shouldn't use it for every single comment (that would be slow and expensive). Instead, we use a Hybrid Strategy:

# RoBERTa (Fast): Handles the bulk of the "easy" sentiment.

# LLM (Deep): Analyzes "High-Impact" comments (top-liked) to detect sarcasm, slang, and cultural nuances that standard models miss.


import pandas as pd
from transformers import pipeline
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Professional path resolution to find .env at project root
# Goes up 4 levels: audience -> video_intelligence -> src -> project_root
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")

class CommentsSentiment:
    def __init__(self):
        # 1. Local Model for Bulk (Fast & Free)
        self.local_pipe = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment"
        )
        self.label_map = {"LABEL_0": -1, "LABEL_1": 0, "LABEL_2": 1}
        
        # 2. Gemini Setup (Deep Reasoning)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ Warning: GEMINI_API_KEY not found in environment variables.")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def _call_gemini_for_nuance(self, text: str) -> int:
        """
        Uses Gemini to detect sarcasm/slang.
        """
        prompt = f"""
        Analyze the sentiment of this YouTube comment. 
        Detect sarcasm, slang, or irony. 
        Return ONLY the number: 1 (positive), 0 (neutral), -1 (negative).
        
        Comment: "{text}"
        """
        try:
            response = self.model.generate_content(prompt)
            # Clean response text in case Gemini adds extra spaces/newlines
            result = response.text.strip()
            return int(result)
        except Exception as e:
            print(f"Gemini Error: {e}")
            return None

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty: return df

        # Step 1: Bulk process with RoBERTa
        texts = df['clean_text'].str.slice(0, 512).tolist()
        local_results = self.local_pipe(texts)
        df['sentiment_score'] = [self.label_map[r['label']] for r in local_results]

        # Step 2: Refine High-Impact comments with Gemini
        # Refine comments with > 10 likes or specific keywords
        influence_mask = df['like_count'] >= 10
        
        for idx, row in df[influence_mask].iterrows():
            llm_score = self._call_gemini_for_nuance(row['text'])
            if llm_score is not None:
                df.at[idx, 'sentiment_score'] = llm_score
                df.at[idx, 'is_llm_verified'] = True
            else:
                df.at[idx, 'is_llm_verified'] = False

        return df