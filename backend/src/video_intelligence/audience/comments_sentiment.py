# from transformers import pipeline
# import pandas as pd
# from google import genai
# import os
# from dotenv import load_dotenv
# from pathlib import Path
# import json

# # Load .env
# base_dir = Path(__file__).resolve().parent.parent.parent.parent
# load_dotenv(base_dir / ".env")


# class CommentsSentiment:
#     def __init__(self):
#         # 🔹 Fast local model
#         self.local_pipe = pipeline(
#             "sentiment-analysis",
#             model="cardiffnlp/twitter-roberta-base-sentiment"
#         )

#         self.label_map = {
#             "LABEL_0": -1,
#             "LABEL_1": 0,
#             "LABEL_2": 1
#         }

#         # 🔹 Gemini (new SDK)
#         api_key = os.getenv("GEMINI_API_KEY")
#         self.client = genai.Client(api_key=api_key)

#     # ----------------------------------
#     # 🔥 SAFE BATCH GEMINI
#     # ----------------------------------
#     def _batch_gemini(self, texts):
#         prompt = f"""
#         Classify sentiment of each comment.

#         Return ONLY a valid JSON list of integers:
#         1 = positive
#         0 = neutral
#         -1 = negative

#         Example output:
#         [1, 0, -1]

#         Comments:
#         {texts}
#         """

#         try:
#             response = self.client.models.generate_content(
#                 model="gemini-2.5-flash",
#                 contents=prompt
#             )

#             result = response.text.strip()

#             # 🔥 SAFE PARSING (no eval)
#             scores = json.loads(result)

#             if not isinstance(scores, list):
#                 raise ValueError("Invalid format")

#             return scores

#         except Exception as e:
#             print(f"Gemini batch error: {e}")
#             return None  # important change

#     # ----------------------------------
#     # MAIN FUNCTION
#     # ----------------------------------
#     def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
#         if df.empty:
#             return df

#         # 🔹 Step 1: Local sentiment
#         texts = df['clean_text'].fillna("").str.slice(0, 512).tolist()
#         local_results = self.local_pipe(texts)

#         df['sentiment_score'] = [
#             self.label_map[r['label']] for r in local_results
#         ]

#         # Ensure float (prevents dtype warnings later)
#         df['sentiment_score'] = df['sentiment_score'].astype(float)

#         # 🔹 Step 2: High-impact filtering
#         high_impact = df[df['like_count'] >= 10]

#         if not high_impact.empty:
#             scores = self._batch_gemini(high_impact['text'].tolist())

#             # 🔥 Only update if Gemini worked
#             if scores is not None and len(scores) == len(high_impact):
#                 for idx, score in zip(high_impact.index, scores):
#                     if score is not None:
#                         df.at[idx, 'sentiment_score'] = float(score)
#                         df.at[idx, 'is_llm_verified'] = True
#                     else:
#                         df.at[idx, 'is_llm_verified'] = False
#             else:
#                 # fallback: mark but don't overwrite
#                 df.loc[high_impact.index, 'is_llm_verified'] = False

#         # 🔹 Final cleanup (safety)
#         df['sentiment_score'] = pd.to_numeric(
#             df['sentiment_score'], errors='coerce'
#         ).fillna(0)

#         return df

import pandas as pd
from transformers import pipeline


class CommentsSentiment:
    def __init__(self):
        self.pipe = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment"
        )

        self.label_map = {
            "LABEL_0": -1,
            "LABEL_1": 0,
            "LABEL_2": 1
        }

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df

        texts = df['clean_text'].fillna("").str.slice(0, 512).tolist()
        results = self.pipe(texts)

        df['sentiment_score'] = [
            float(self.label_map[r['label']]) for r in results
        ]

        return df