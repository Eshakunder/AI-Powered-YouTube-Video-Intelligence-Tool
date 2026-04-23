import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Professional path resolution
# Goes up 4 levels: audience -> video_intelligence -> src -> project_root
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")

class ContradictionAnalyzer:
    def __init__(self):
        # Load the key from the environment
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("❌ GEMINI_API_KEY not found. Check your .env file at project root.")
            
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def detect(self, chunked_df):
        # Identify where Speaker and Audience sentiment diverge significantly
        # Threshold of 1.2 indicates a major vibe shift
        contradictions = chunked_df[
            abs(chunked_df['sentiment_score'] - chunked_df['audience_sentiment']) > 1.2
        ]
        
        insights = []
        for _, row in contradictions.iterrows():
            prompt = f"""
            Analyze the following conflict in a video:
            - Timestamp: {row['start']}s
            - Speaker said: "{row['clean_text']}" (Sentiment: {row['sentiment_score']})
            - Audience reaction (Sentiment: {row['audience_sentiment']})
            
            Briefly explain why the audience might disagree or react differently 
            to what the speaker is saying. Be concise (1 sentence).
            """
            try:
                response = self.model.generate_content(prompt)
                insights.append({
                    "timestamp": row['start'],
                    "explanation": response.text.strip()
                })
            except Exception as e:
                print(f"Contradiction Insight Error: {e}")
        
        return insights