# import sys
# import os

# # Fix import path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# # Core modules
# from src.video_intelligence.preprocessing.transcript import fetch_transcript
# from src.video_intelligence.preprocessing.data_cleaning import preprocess
# from src.video_intelligence.validation.input_validation import InputValidator

# # Audience modules
# from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
# from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
# from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
# from src.video_intelligence.audience.video_sentiment import VideoSentiment

# # Insights
# from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
# from src.video_intelligence.insights.virality_generator import ViralityScorer

# # ✅ Single LLM analyzer
# from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer


# def run():
#     video_id = "2cK2P8Y63E8"

#     # -----------------------------
#     # STEP 1: TRANSCRIPT
#     # -----------------------------
#     print("\n🚀 STEP 1: Fetch Transcript")
#     try:
#         df = fetch_transcript(video_id)
#         print(f"✅ Transcript fetched: {df.shape}")
#     except Exception as e:
#         print(f"❌ Transcript Error: {e}")
#         return

#     # -----------------------------
#     # STEP 2: VALIDATION
#     # -----------------------------
#     print("\n🔍 STEP 2: Validation")
#     validator = InputValidator()
#     is_valid, msg = validator.validate(video_id, df)
#     print(msg)

#     if not is_valid:
#         return

#     # -----------------------------
#     # STEP 3: PREPROCESS TRANSCRIPT
#     # -----------------------------
#     print("\n🔄 STEP 3: Preprocess Transcript")
#     chunked_df = preprocess(df)
#     print(f"✅ Chunked transcript: {chunked_df.shape}")

#     # -----------------------------
#     # STEP 4: FETCH COMMENTS
#     # -----------------------------
#     print("\n💬 STEP 4: Fetch Comments")
#     fetcher = CommentsFetcher(max_comments=50)
#     comments_df = fetcher.fetch(video_id)

#     if comments_df.empty:
#         print("❌ No comments fetched")
#         return

#     print(f"✅ Comments fetched: {len(comments_df)}")

#     # -----------------------------
#     # STEP 5: PREPROCESS COMMENTS
#     # -----------------------------
#     print("\n🧹 STEP 5: Preprocess Comments")
#     processor = CommentsPreprocessor()
#     comments_df = processor.process(comments_df)

#     # -----------------------------
#     # STEP 6: COMMENT SENTIMENT
#     # -----------------------------
#     print("\n🧠 STEP 6: Comment Sentiment")

#     sentiment_model = CommentsSentiment()
#     comments_df = sentiment_model.analyze(comments_df)

#     comments_df['sentiment_score'] = comments_df['sentiment_score'].astype(float)

#     # -----------------------------
#     # STEP 7: VIDEO SENTIMENT
#     # -----------------------------
#     print("\n📈 STEP 7: Video Sentiment")

#     video_model = VideoSentiment()
#     chunked_df = video_model.analyze(chunked_df)

#     # -----------------------------
#     # STEP 8: COGNITIVE ANALYSIS
#     # -----------------------------
#     print("\n🧠 STEP 8: Cognitive Analysis")

#     cognitive = CognitiveTimeline()
#     chunked_df = cognitive.generate(chunked_df)

#     # -----------------------------
#     # STEP 9: VIRALITY SCORING
#     # -----------------------------
#     print("\n🔥 STEP 9: Virality Scoring")

#     scorer = ViralityScorer()
#     chunked_df = scorer.score(chunked_df)

#     top_segments = scorer.select_top(chunked_df, top_k=5)

#     print("\n🎬 TOP VIRAL SEGMENTS:")
#     for seg in top_segments:
#         print(f"⏱ {seg['start']} | 🔥 {seg['score']}")

#     # -----------------------------
#     # STEP 10: GLOBAL SENTIMENT
#     # -----------------------------
#     print("\n📊 STEP 10: Global Sentiment")

#     video_sentiment = chunked_df['sentiment_score'].mean()
#     comments_sentiment = comments_df['sentiment_score'].mean()

#     print(f"🎬 Video Sentiment: {video_sentiment:.3f}")
#     print(f"💬 Comments Sentiment: {comments_sentiment:.3f}")

#     # -----------------------------
#     # STEP 11: SINGLE LLM INSIGHT
#     # -----------------------------
#     print("\n⚡ STEP 11: Unified Insight Generation")

#     analyzer = VideoInsightsAnalyzer()

#     insight = analyzer.analyze(
#         chunked_df,
#         comments_df,
#         video_sentiment,
#         comments_sentiment
#     )

#     print("\n🧠 FINAL INSIGHT:")
#     print(insight)

#     # -----------------------------
#     # STEP 12: COMMENT DISTRIBUTION
#     # -----------------------------
#     print("\n📊 STEP 12: Comment Distribution")

#     total = len(comments_df)

#     pos = (comments_df['sentiment_score'] > 0).sum() / total
#     neg = (comments_df['sentiment_score'] < 0).sum() / total
#     neu = (comments_df['sentiment_score'] == 0).sum() / total

#     print(f"Positive: {pos:.2%}")
#     print(f"Neutral : {neu:.2%}")
#     print(f"Negative: {neg:.2%}")


# if __name__ == "__main__":
#     run()

##virality generator not changed.
# import os
# import sys

# # Fix path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# # Core
# from src.video_intelligence.preprocessing.transcript import fetch_transcript
# from src.video_intelligence.preprocessing.data_cleaning import preprocess
# from src.video_intelligence.validation.input_validation import InputValidator

# # Audience
# from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
# from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
# from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
# from src.video_intelligence.audience.video_sentiment import VideoSentiment

# # Insights
# from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
# from src.video_intelligence.insights.virality_generator import ViralityScorer
# from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer


# # Load models once
# validator = InputValidator()
# fetcher = CommentsFetcher(max_comments=50)
# processor = CommentsPreprocessor()

# comment_model = CommentsSentiment()
# video_model = VideoSentiment()

# cognitive = CognitiveTimeline()
# scorer = ViralityScorer()

# llm = VideoInsightsAnalyzer()


# def run():
#     video_id = "2cK2P8Y63E8"

#     print("\n🚀 STEP 1: Transcript")
#     df = fetch_transcript(video_id)

#     is_valid, msg = validator.validate(video_id, df)
#     print(msg)
#     if not is_valid:
#         return

#     chunked_df = preprocess(df)

#     print("\n💬 STEP 2: Comments")
#     comments_df = fetcher.fetch(video_id)

#     if comments_df.empty:
#         print("❌ No comments")
#         return

#     comments_df = processor.process(comments_df)

#     print("\n🧠 STEP 3: Sentiment")
#     comments_df = comment_model.analyze(comments_df)
#     chunked_df = video_model.analyze(chunked_df)

#     print("\n📈 STEP 4: Insights")
#     chunked_df = cognitive.generate(chunked_df)
#     chunked_df = scorer.score(chunked_df)

#     top_segments = scorer.select_top(chunked_df, top_k=5)

#     print("\n🔥 TOP SEGMENTS:")
#     for seg in top_segments:
#         print(seg)

#     video_sent = chunked_df['sentiment_score'].mean()
#     comment_sent = comments_df['sentiment_score'].mean()

#     print("\n📊 Sentiment:")
#     print("Video:", video_sent)
#     print("Comments:", comment_sent)

#     print("\n⚡ STEP 5: LLM Insight")
#     insight = llm.analyze(
#         chunked_df,
#         comments_df,
#         video_sent,
#         comment_sent
#     )

#     print("\n🧠 FINAL INSIGHT:")
#     print(insight)


# if __name__ == "__main__":
#     run()


##virality generator changed.
# import os
# import sys
# import pandas as pd
# import numpy as np
# import math
# from bson import ObjectId

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# # Core
# from src.video_intelligence.preprocessing.transcript import fetch_transcript
# from src.video_intelligence.preprocessing.data_cleaning import preprocess
# from src.video_intelligence.validation.input_validation import InputValidator

# # Audience
# from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
# from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
# from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
# from src.video_intelligence.audience.video_sentiment import VideoSentiment

# # Insights
# from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
# from src.video_intelligence.insights.virality_generator import ViralityScorer
# from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer

# # Database
# from src.database.mongo import MongoDBClient


# def clean_dataframe(df):
#     return df.replace([np.inf, -np.inf], np.nan).fillna(0)


# def safe_float(val):
#     if val is None:
#         return 0.0
#     if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
#         return 0.0
#     return float(val)


# class VideoAnalysisPipeline:
#     def __init__(self):
#         self.validator = InputValidator()
#         self.comment_fetcher = CommentsFetcher(max_comments=50)
#         self.comment_processor = CommentsPreprocessor()
#         self.comment_sentiment = CommentsSentiment()
#         self.video_sentiment = VideoSentiment()
#         self.cognitive = CognitiveTimeline()
#         self.virality = ViralityScorer()
#         self.llm = VideoInsightsAnalyzer()
#         self.db = MongoDBClient()

#     def run(self, video_id: str, user_id: str):
#         try:
#             # CACHE
#             existing = self.db.analysis_collection.find_one({
#                 "video_id": video_id,
#                 "user_id": user_id
#             })
#             if existing:
#                 existing["_id"] = str(existing["_id"])
#                 return existing

#             # STEP 1: Transcript
#             df = fetch_transcript(video_id)
#             is_valid, msg = self.validator.validate(video_id, df)
#             if not is_valid:
#                 return {"error": msg}

#             chunked_df = preprocess(df)

#             # STEP 2: Comments
#             comments_df = self.comment_fetcher.fetch(video_id)
#             if comments_df.empty:
#                 return {"error": "No comments found"}

#             comments_df = self.comment_processor.process(comments_df)

#             # STEP 3: Sentiment
#             comments_df = self.comment_sentiment.analyze(comments_df)
#             chunked_df = self.video_sentiment.analyze(chunked_df)

#             comments_df = clean_dataframe(comments_df)
#             chunked_df = clean_dataframe(chunked_df)

#             # STEP 4: Insights
#             chunked_df = self.cognitive.generate(chunked_df)
#             chunked_df = self.virality.score(chunked_df)

#             chunked_df = clean_dataframe(chunked_df)

#             # 🔥 TOP 3 MOMENTS
#             top_moments = self.virality.select_top(chunked_df, top_k=3)

#             # 🔥 TIMELINE (KEY ADDITION)
#             timeline_data = chunked_df[[
#                 'start',
#                 'end',
#                 'sentiment_score',
#                 'virality_score'
#             ]].to_dict(orient="records")

#             # STEP 5: Metrics
#             video_sent = safe_float(chunked_df['sentiment_score'].mean())
#             comment_sent = safe_float(comments_df['sentiment_score'].mean())

#             total = len(comments_df)
#             distribution = {
#                 "positive": safe_float((comments_df['sentiment_score'] > 0).sum() / total),
#                 "neutral": safe_float((comments_df['sentiment_score'] == 0).sum() / total),
#                 "negative": safe_float((comments_df['sentiment_score'] < 0).sum() / total),
#             }

#             # STEP 6: LLM
#             insight = self.llm.analyze(
#                 chunked_df,
#                 comments_df,
#                 video_sent,
#                 comment_sent
#             )

#             comments_sample = comments_df.head(10).to_dict(orient="records")

#             # 🔥 FINAL RESULT
#             result = {
#                 "video_id": video_id,
#                 "metrics": {
#                     "video_sentiment": video_sent,
#                     "comments_sentiment": comment_sent
#                 },
#                 "distribution": distribution,
#                 "top_moments": top_moments,   # ✅ NEW
#                 "timeline_data": timeline_data,  # ✅ NEW
#                 "insight": insight,
#                 "comments_sample": comments_sample
#             }

#             mongo_id = self.db.save_analysis(user_id, result)
#             result["db_id"] = mongo_id

#             return result

#         except Exception as e:
#             return {"error": str(e)}


# import os
# import sys
# import pandas as pd
# import numpy as np
# import math
# from datetime import datetime, timezone
# from bson import ObjectId

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# # Core
# from src.video_intelligence.preprocessing.transcript import fetch_transcript
# from src.video_intelligence.preprocessing.data_cleaning import preprocess
# from src.video_intelligence.validation.input_validation import InputValidator

# # Audience
# from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
# from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
# from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
# from src.video_intelligence.audience.video_sentiment import VideoSentiment

# # Insights
# from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
# from src.video_intelligence.insights.virality_generator import ViralityScorer
# from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer

# # Database
# from src.database.mongo import MongoDBClient


# def convert_objectid(data):
#     if isinstance(data, list):
#         return [convert_objectid(item) for item in data]
#     elif isinstance(data, dict):
#         return {k: convert_objectid(v) for k, v in data.items()}
#     elif isinstance(data, ObjectId):
#         return str(data)
#     return data


# def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
#     """Replace inf/nan with 0 so JSON serialisation never fails."""
#     return df.replace([np.inf, -np.inf], np.nan).fillna(0)


# def safe_float(val) -> float:
#     if val is None:
#         return 0.0
#     try:
#         f = float(val)
#     except (TypeError, ValueError):
#         return 0.0
#     return 0.0 if (math.isnan(f) or math.isinf(f)) else f


# def build_top_moments(df: pd.DataFrame, top_k: int = 3) -> list[dict]:
#     """
#     Return the top-k viral moments as a list of dicts that always contain:
#         start        – float seconds
#         end          – float seconds
#         virality_score – float
#     This avoids frontend crashes caused by missing or misnamed keys.
#     """
#     required = {"start", "end", "virality_score"}
#     if not required.issubset(df.columns):
#         # Graceful fallback: return empty list rather than crash
#         return []

#     top = (
#         df[list(required)]
#         .dropna()
#         .sort_values("virality_score", ascending=False)
#         .head(top_k)
#     )
#     moments = []
#     for _, row in top.iterrows():
#         moments.append({
#             "start": safe_float(row["start"]),
#             "end": safe_float(row["end"]),
#             "virality_score": safe_float(row["virality_score"]),
#         })
#     return moments


# def build_timeline(df: pd.DataFrame) -> list[dict]:
#     """
#     Return per-segment timeline data containing only the four keys the
#     frontend chart needs.  Safe against missing columns.
#     """
#     cols = ["start", "end", "sentiment_score", "virality_score"]
#     available = [c for c in cols if c in df.columns]
#     timeline = clean_dataframe(df[available]).to_dict(orient="records")
#     # Normalise every numeric value through safe_float
#     return [
#         {k: safe_float(v) if isinstance(v, (int, float, np.floating)) else v
#          for k, v in row.items()}
#         for row in timeline
#     ]


# class VideoAnalysisPipeline:
#     def __init__(self):
#         self.validator = InputValidator()
#         self.comment_fetcher = CommentsFetcher(max_comments=50)
#         self.comment_processor = CommentsPreprocessor()
#         self.comment_sentiment = CommentsSentiment()
#         self.video_sentiment = VideoSentiment()
#         self.cognitive = CognitiveTimeline()
#         self.virality = ViralityScorer()
#         self.llm = VideoInsightsAnalyzer()
#         self.db = MongoDBClient()

#     def run(self, video_id: str, user_id: str) -> dict:
#         try:
#             # ── CACHE ────────────────────────────────────────────────────────
#             existing = self.db.analysis_collection.find_one(
#                 {"video_id": video_id, "user_id": user_id}
#             )
#             if existing:
#                 existing["_id"] = str(existing["_id"])
#                 return existing

#             # ── STEP 1: Transcript ───────────────────────────────────────────
#             df = fetch_transcript(video_id)
#             is_valid, msg = self.validator.validate(video_id, df)
#             if not is_valid:
#                 return {"error": msg}

#             chunked_df = preprocess(df)

#             # ── STEP 2: Comments ─────────────────────────────────────────────
#             comments_df = self.comment_fetcher.fetch(video_id)
#             if comments_df.empty:
#                 return {"error": "No comments found"}

#             comments_df = self.comment_processor.process(comments_df)

#             # ── STEP 3: Sentiment ────────────────────────────────────────────
#             comments_df = self.comment_sentiment.analyze(comments_df)
#             chunked_df = self.video_sentiment.analyze(chunked_df)

#             comments_df = clean_dataframe(comments_df)
#             chunked_df = clean_dataframe(chunked_df)

#             # ── STEP 4: Insights ─────────────────────────────────────────────
#             chunked_df = self.cognitive.generate(chunked_df)
#             chunked_df = self.virality.score(chunked_df)
#             chunked_df = clean_dataframe(chunked_df)

#             # ── STEP 5: Derived outputs ──────────────────────────────────────
#             top_moments = build_top_moments(chunked_df, top_k=3)
#             timeline_data = build_timeline(chunked_df)

#             video_sent = safe_float(chunked_df["sentiment_score"].mean())
#             comment_sent = safe_float(comments_df["sentiment_score"].mean())

#             total = len(comments_df)
#             if total == 0:
#                 return {"error": "No comments to analyse"}

#             distribution = {
#                 "positive": safe_float((comments_df["sentiment_score"] > 0).sum() / total),
#                 "neutral": safe_float((comments_df["sentiment_score"] == 0).sum() / total),
#                 "negative": safe_float((comments_df["sentiment_score"] < 0).sum() / total),
#             }

#             # ── STEP 6: LLM ──────────────────────────────────────────────────
#             insight = self.llm.analyze(
#                 chunked_df, comments_df, video_sent, comment_sent
#             )

#             # ── STEP 7: Assemble result ──────────────────────────────────────
#             comments_sample = (
#                 clean_dataframe(comments_df.head(10))
#                 .to_dict(orient="records")
#             )

#             result = {
#                 "video_id": video_id,
#                 "created_at": datetime.now(timezone.utc).isoformat(),
#                 "metrics": {
#                     "video_sentiment": video_sent,
#                     "comments_sentiment": comment_sent,
#                 },
#                 "distribution": distribution,
#                 # Virality: timestamp range + virality_score only (no sentiment)
#                 "top_moments": top_moments,
#                 # Timeline: full per-segment data for charts
#                 "timeline_data": timeline_data,
#                 "insight": insight,
#                 "comments_sample": comments_sample,
#             }

#             mongo_id = self.db.save_analysis(user_id, result)
#             result["db_id"] = mongo_id

#             return convert_objectid(result)

#         except Exception as e:
#             return {"error": str(e)}
        


import os
import sys
import pandas as pd
import numpy as np
import math
from datetime import datetime, timezone
from bson import ObjectId

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# Core
from src.video_intelligence.preprocessing.transcript import fetch_transcript
from src.video_intelligence.preprocessing.data_cleaning import preprocess
from src.video_intelligence.validation.input_validation import InputValidator

# Audience
from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
from src.video_intelligence.audience.video_sentiment import VideoSentiment

# Insights
from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
from src.video_intelligence.insights.virality_generator import ViralityScorer
from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer

# Database
from src.database.mongo import MongoDBClient


def convert_objectid(data):
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    return data


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Replace inf/nan with 0 so JSON serialisation never fails."""
    return df.replace([np.inf, -np.inf], np.nan).fillna(0)


def safe_float(val) -> float:
    if val is None:
        return 0.0
    try:
        f = float(val)
    except (TypeError, ValueError):
        return 0.0
    return 0.0 if (math.isnan(f) or math.isinf(f)) else f


def build_top_moments(df: pd.DataFrame, top_k: int = 3) -> list[dict]:
    """
    Return the top-k viral moments as a list of dicts that always contain:
        start        – float seconds
        end          – float seconds
        virality_score – float
    This avoids frontend crashes caused by missing or misnamed keys.
    """
    required = {"start", "end", "virality_score"}
    if not required.issubset(df.columns):
        # Graceful fallback: return empty list rather than crash
        return []

    top = (
        df[list(required)]
        .dropna()
        .sort_values("virality_score", ascending=False)
        .head(top_k)
    )
    moments = []
    for _, row in top.iterrows():
        moments.append({
            "start": safe_float(row["start"]),
            "end": safe_float(row["end"]),
            "virality_score": safe_float(row["virality_score"]),
        })
    return moments


def build_timeline(df: pd.DataFrame) -> list[dict]:
    """
    Return per-segment timeline data containing only the four keys the
    frontend chart needs.  Safe against missing columns.
    """
    cols = ["start", "end", "sentiment_score", "virality_score"]
    available = [c for c in cols if c in df.columns]
    timeline = clean_dataframe(df[available]).to_dict(orient="records")
    # Normalise every numeric value through safe_float
    return [
        {k: safe_float(v) if isinstance(v, (int, float, np.floating)) else v
         for k, v in row.items()}
        for row in timeline
    ]


class VideoAnalysisPipeline:
    def __init__(self):
        self.validator = InputValidator()
        self.comment_fetcher = CommentsFetcher(max_comments=50)
        self.comment_processor = CommentsPreprocessor()
        self.comment_sentiment = CommentsSentiment()
        self.video_sentiment = VideoSentiment()
        self.cognitive = CognitiveTimeline()
        self.virality = ViralityScorer()
        self.llm = VideoInsightsAnalyzer()
        self.db = MongoDBClient()

    def run(self, video_id: str, user_id: str) -> dict:
        try:
            # ── CACHE ────────────────────────────────────────────────────────
            existing = self.db.analysis_collection.find_one(
                {"video_id": video_id, "user_id": user_id}
            )
            if existing:
                existing["_id"] = str(existing["_id"])
                # Migrate legacy key: old pipeline used "top_segments" with
                # a "score" field; new frontend expects "top_moments" with
                # "virality_score". Normalise in-place so cached docs work.
                if "top_moments" not in existing and "top_segments" in existing:
                    existing["top_moments"] = [
                        {
                            "start": safe_float(m.get("start", 0)),
                            "end": safe_float(m.get("end", 0)),
                            "virality_score": safe_float(
                                m.get("virality_score") or m.get("score", 0)
                            ),
                        }
                        for m in (existing.get("top_segments") or [])
                    ]
                return existing

            # ── STEP 1: Transcript ───────────────────────────────────────────
            df = fetch_transcript(video_id)
            is_valid, msg = self.validator.validate(video_id, df)
            if not is_valid:
                return {"error": msg}

            chunked_df = preprocess(df)

            # ── STEP 2: Comments ─────────────────────────────────────────────
            comments_df = self.comment_fetcher.fetch(video_id)
            if comments_df.empty:
                return {"error": "No comments found"}

            comments_df = self.comment_processor.process(comments_df)

            # ── STEP 3: Sentiment ────────────────────────────────────────────
            comments_df = self.comment_sentiment.analyze(comments_df)
            chunked_df = self.video_sentiment.analyze(chunked_df)

            comments_df = clean_dataframe(comments_df)
            chunked_df = clean_dataframe(chunked_df)

            # ── STEP 4: Insights ─────────────────────────────────────────────
            chunked_df = self.cognitive.generate(chunked_df)
            chunked_df = self.virality.score(chunked_df)
            chunked_df = clean_dataframe(chunked_df)

            # ── STEP 5: Derived outputs ──────────────────────────────────────
            top_moments = build_top_moments(chunked_df, top_k=3)
            timeline_data = build_timeline(chunked_df)

            video_sent = safe_float(chunked_df["sentiment_score"].mean())
            comment_sent = safe_float(comments_df["sentiment_score"].mean())

            total = len(comments_df)
            if total == 0:
                return {"error": "No comments to analyse"}

            distribution = {
                "positive": safe_float((comments_df["sentiment_score"] > 0).sum() / total),
                "neutral": safe_float((comments_df["sentiment_score"] == 0).sum() / total),
                "negative": safe_float((comments_df["sentiment_score"] < 0).sum() / total),
            }

            # ── STEP 6: LLM ──────────────────────────────────────────────────
            insight = self.llm.analyze(
                chunked_df, comments_df, video_sent, comment_sent
            )

            # ── STEP 7: Assemble result ──────────────────────────────────────
            comments_sample = (
                clean_dataframe(comments_df.head(10))
                .to_dict(orient="records")
            )

            result = {
                "video_id": video_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "metrics": {
                    "video_sentiment": video_sent,
                    "comments_sentiment": comment_sent,
                },
                "distribution": distribution,
                # Virality: timestamp range + virality_score only (no sentiment)
                "top_moments": top_moments,
                # Timeline: full per-segment data for charts
                "timeline_data": timeline_data,
                "insight": insight,
                "comments_sample": comments_sample,
            }

            mongo_id = self.db.save_analysis(user_id, result)
            result["db_id"] = mongo_id

            return convert_objectid(result)

        except Exception as e:
            return {"error": str(e)}