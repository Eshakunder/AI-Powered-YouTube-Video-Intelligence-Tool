# import pandas as pd
# from transformers import pipeline
# from google import genai
# import os
# from dotenv import load_dotenv
# from pathlib import Path
# import json

# # Load .env
# base_dir = Path(__file__).resolve().parent.parent.parent.parent
# load_dotenv(base_dir / ".env")


# class VideoSentiment:
#     def __init__(self):
#         # 🔹 Fast baseline model
#         self.local_pipe = pipeline(
#             "sentiment-analysis",
#             model="cardiffnlp/twitter-roberta-base-sentiment"
#         )

#         self.label_map = {
#             "LABEL_0": -1,
#             "LABEL_1": 0,
#             "LABEL_2": 1
#         }

#         # 🔹 LLM setup
#         api_key = os.getenv("GEMINI_API_KEY")
#         self.client = genai.Client(api_key=api_key)

#     # ----------------------------------
#     # 🔥 LLM BATCH REFINEMENT
#     # ----------------------------------
#     def _batch_llm(self, texts):
#         formatted = "\n".join(
#             [f"{i+1}. {t}" for i, t in enumerate(texts)]
#         )

#         prompt = f"""
#         Analyze sentiment of each sentence.

#         Return ONLY JSON list of floats between -1 and 1.

#         -1 = very negative
#         0 = neutral
#         +1 = very positive

#         Sentences:
#         {formatted}
#         """

#         try:
#             response = self.client.models.generate_content(
#                 model="gemini-2.5-flash",
#                 contents=prompt
#             )

#             scores = json.loads(response.text.strip())
#             return scores

#         except Exception as e:
#             print(f"LLM error: {e}")
#             return None

#     # ----------------------------------
#     # MAIN PIPELINE
#     # ----------------------------------
#     def analyze(self, chunked_df: pd.DataFrame) -> pd.DataFrame:
#         if chunked_df.empty:
#             return chunked_df

#         # -----------------------------
#         # STEP 1: RoBERTa baseline
#         # -----------------------------
#         texts = chunked_df['clean_text'].fillna("").str.slice(0, 512).tolist()

#         results = self.local_pipe(texts)

#         chunked_df['sentiment_score'] = [
#             self.label_map[r['label']] for r in results
#         ]

#         # convert to float
#         chunked_df['sentiment_score'] = chunked_df['sentiment_score'].astype(float)

#         # -----------------------------
#         # STEP 2: FILTER (important chunks)
#         # -----------------------------
#         # refine only strong or long chunks
#         mask = (
#             (chunked_df['sentiment_score'].abs() == 1) |  # strong sentiment
#             (chunked_df['clean_text'].str.len() > 120)     # long content
#         )

#         important_chunks = chunked_df[mask]

#         # -----------------------------
#         # STEP 3: LLM refinement
#         # -----------------------------
#         if not important_chunks.empty:
#             texts = important_chunks['clean_text'].tolist()

#             batch_size = 15
#             all_scores = []

#             for i in range(0, len(texts), batch_size):
#                 batch = texts[i:i + batch_size]
#                 scores = self._batch_llm(batch)

#                 if scores is None:
#                     scores = [None] * len(batch)

#                 all_scores.extend(scores)

#             # update values
#             for idx, score in zip(important_chunks.index, all_scores):
#                 if score is not None:
#                     chunked_df.at[idx, 'sentiment_score'] = float(score)
#                     chunked_df.at[idx, 'is_llm_refined'] = True
#                 else:
#                     chunked_df.at[idx, 'is_llm_refined'] = False

#         # -----------------------------
#         # STEP 4: SMOOTHING
#         # -----------------------------
#         chunked_df['smoothed_sentiment'] = (
#             chunked_df['sentiment_score']
#             .rolling(window=5, min_periods=1)
#             .mean()
#         )

#         return chunked_df

import pandas as pd
import json
import re
import os
from transformers import pipeline
from google import genai
from dotenv import load_dotenv
from pathlib import Path

# Load env
base_dir = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(base_dir / ".env")


class VideoSentiment:
    def __init__(self):
        # Local fast model
        self.local_pipe = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment"
        )

        self.label_map = {
            "LABEL_0": -1,
            "LABEL_1": 0,
            "LABEL_2": 1
        }

        # Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key)

    # -----------------------------
    # SAFE LLM BATCH
    # -----------------------------
    def _batch_llm(self, texts):
        formatted = "\n".join([f"{i+1}. {t}" for i, t in enumerate(texts)])

        prompt = f"""
Return ONLY a JSON array of floats between -1 and 1.

Example:
[0.5, -0.2, 0.0]

Sentences:
{formatted}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt
            )

            if not response or not response.text:
                return None

            raw = response.text.strip()

            try:
                return json.loads(raw)

            except:
                # fallback: extract numbers
                nums = re.findall(r'-?\d+\.\d+|-?\d+', raw)
                if not nums:
                    return None
                return [float(n) for n in nums]

        except Exception as e:
            print("LLM error:", e)
            return None

    # -----------------------------
    # MAIN
    # -----------------------------
    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df

        df['is_llm_refined'] = False

        texts = df['clean_text'].fillna("").str.slice(0, 512).tolist()
        results = self.local_pipe(texts)

        df['sentiment_score'] = [
            float(self.label_map[r['label']]) for r in results
        ]

        # Select important chunks
        mask = (
            (df['sentiment_score'].abs() >= 0.8) |
            (df['clean_text'].str.len() > 150)
        )

        important = df[mask]

        if not important.empty:
            texts = important['clean_text'].tolist()
            batch_size = 15
            all_scores = []

            for i in range(0, len(texts), batch_size):
                batch = texts[i:i+batch_size]
                scores = self._batch_llm(batch)

                if scores is None or len(scores) != len(batch):
                    scores = [None] * len(batch)

                all_scores.extend(scores)

            for idx, score in zip(important.index, all_scores):
                if score is not None:
                    df.at[idx, 'sentiment_score'] = float(score)
                    df.at[idx, 'is_llm_refined'] = True

        # Smooth
        df['smoothed_sentiment'] = (
            df['sentiment_score']
            .rolling(window=5, min_periods=1)
            .mean()
        )

        return df