# import sys
# import os

# # Ensure the app can find your src folder
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# from src.video_intelligence.preprocessing.transcript import fetch_transcript
# from src.video_intelligence.preprocessing.data_cleaning import preprocess
# from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
# from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
# from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
# from src.video_intelligence.audience.video_sentiment import VideoSentiment
# from src.video_intelligence.insights.virality_generator import ViralityScorer
# from src.video_intelligence.audience.llm_results import VideoInsightsAnalyzer

# def run_video_analysis(video_id: str):
#     """
#     Refactored version of your 'run' script that returns a 
#     dictionary instead of printing to the terminal.
#     """
#     # 1. Fetch & Preprocess Transcript
#     df = fetch_transcript(video_id)
#     chunked_df = preprocess(df)

#     # 2. Fetch & Preprocess Comments
#     fetcher = CommentsFetcher(max_comments=50)
#     comments_df = fetcher.fetch(video_id)
    
#     if comments_df.empty:
#         raise ValueError("No comments found for this video.")

#     processor = CommentsPreprocessor()
#     comments_df = processor.process(comments_df)

#     # 3. Sentiment Analysis (Uses RoBERTa locally)
#     sentiment_model = CommentsSentiment()
#     comments_df = sentiment_model.analyze(comments_df)
    
#     video_model = VideoSentiment()
#     chunked_df = video_model.analyze(chunked_df)

#     # 4. Virality & Global Stats
#     scorer = ViralityScorer()
#     chunked_df = scorer.score(chunked_df)
#     top_segments = scorer.select_top(chunked_df, top_k=3)

#     video_sentiment = float(chunked_df['sentiment_score'].mean())
#     comments_sentiment = float(comments_df['sentiment_score'].mean())

#     # 5. LLM Insight (Gemini Cloud)
#     analyzer = VideoInsightsAnalyzer()
#     insight = analyzer.analyze(chunked_df, comments_df, video_sentiment, comments_sentiment)

#     # 6. Distribution stats
#     total = len(comments_df)
#     dist = {
#         "positive": float((comments_df['sentiment_score'] > 0).sum() / total),
#         "neutral": float((comments_df['sentiment_score'] == 0).sum() / total),
#         "negative": float((comments_df['sentiment_score'] < 0).sum() / total)
#     }

#     return {
#         "video_id": video_id,
#         "scores": {
#             "video": video_sentiment,
#             "comments": comments_sentiment
#         },
#         "distribution": dist,
#         "top_moments": top_segments,
#         "ai_insight": insight
#     }
# import os
# import sys
# import pandas as pd
# from bson import ObjectId

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

# # Database
# from src.database.mongo import MongoDBClient


# # ✅ Helper function to convert ObjectId → string
# def convert_objectid(data):
#     if isinstance(data, list):
#         return [convert_objectid(item) for item in data]
#     elif isinstance(data, dict):
#         return {k: convert_objectid(v) for k, v in data.items()}
#     elif isinstance(data, ObjectId):
#         return str(data)
#     else:
#         return data


# class VideoAnalysisPipeline:
#     def __init__(self):
#         """Load models ONCE"""
#         self.validator = InputValidator()

#         self.comment_fetcher = CommentsFetcher(max_comments=50)
#         self.comment_processor = CommentsPreprocessor()

#         self.comment_sentiment = CommentsSentiment()
#         self.video_sentiment = VideoSentiment()

#         self.cognitive = CognitiveTimeline()
#         self.virality = ViralityScorer()

#         self.llm = VideoInsightsAnalyzer()
#         self.db = MongoDBClient()

#     def run(self, video_id: str):
#         try:
#             # 🔥 STEP 0: Check DB (Cache)
#             existing = self.db.analysis_collection.find_one({"video_id": video_id})
#             if existing:
#                 existing["_id"] = str(existing["_id"])
#                 return existing

#             # STEP 1: Fetch Transcript
#             df = fetch_transcript(video_id)
#             is_valid, msg = self.validator.validate(video_id, df)
#             if not is_valid:
#                 return {"error": msg}

#             chunked_df = preprocess(df)

#             # STEP 2: Fetch Comments
#             comments_df = self.comment_fetcher.fetch(video_id)
#             if comments_df.empty:
#                 return {"error": "No comments found"}

#             comments_df = self.comment_processor.process(comments_df)

#             # STEP 3: Sentiment Analysis
#             comments_df = self.comment_sentiment.analyze(comments_df)
#             chunked_df = self.video_sentiment.analyze(chunked_df)

#             # STEP 4: Insights
#             chunked_df = self.cognitive.generate(chunked_df)
#             chunked_df = self.virality.score(chunked_df)
#             top_segments = self.virality.select_top(chunked_df, top_k=5)

#             # STEP 5: Metrics
#             video_sent = float(chunked_df['sentiment_score'].mean())
#             comment_sent = float(comments_df['sentiment_score'].mean())

#             total = len(comments_df)
#             distribution = {
#                 "positive": float((comments_df['sentiment_score'] > 0).sum() / total),
#                 "neutral": float((comments_df['sentiment_score'] == 0).sum() / total),
#                 "negative": float((comments_df['sentiment_score'] < 0).sum() / total),
#             }

#             # STEP 6: LLM Insights
#             insight = self.llm.analyze(
#                 chunked_df,
#                 comments_df,
#                 video_sent,
#                 comment_sent
#             )

#             # STEP 7: Final Result
#             result = {
#                 "video_id": video_id,
#                 "metrics": {
#                     "video_sentiment": video_sent,
#                     "comments_sentiment": comment_sent
#                 },
#                 "distribution": distribution,
#                 "top_segments": top_segments,
#                 "insight": insight,
#                 "timeline_data": chunked_df.to_dict(orient="records"),
#                 "comments_sample": comments_df.head(10).to_dict(orient="records")
#             }

#             # ✅ Save to MongoDB
#             mongo_id = self.db.save_analysis(result)
#             result["db_id"] = mongo_id

#             # ✅ Convert ObjectId before returning
#             result = convert_objectid(result)

#             return result

#         except Exception as e:
#             return {"error": str(e)}

import os
import sys
import pandas as pd
import numpy as np
import math
from bson import ObjectId

# Fix path
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


# ✅ ObjectId converter
def convert_objectid(data):
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data


# ✅ FIX 1: Clean DataFrame
def clean_dataframe(df):
    return df.replace([np.inf, -np.inf], np.nan).fillna(0)


# ✅ FIX 2: Safe float
def safe_float(val):
    if val is None:
        return 0.0
    if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
        return 0.0
    return float(val)


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

    def run(self, video_id: str, user_id: str):
        try:
            # 🔥 CACHE CHECK
            existing = self.db.analysis_collection.find_one({
                "video_id": video_id,
                "user_id": user_id
            })
            if existing:
                existing["_id"] = str(existing["_id"])
                return existing

            # STEP 1: Transcript
            df = fetch_transcript(video_id)
            is_valid, msg = self.validator.validate(video_id, df)
            if not is_valid:
                return {"error": msg}

            chunked_df = preprocess(df)

            # STEP 2: Comments
            comments_df = self.comment_fetcher.fetch(video_id)
            if comments_df.empty:
                return {"error": "No comments found"}

            comments_df = self.comment_processor.process(comments_df)

            # STEP 3: Sentiment
            comments_df = self.comment_sentiment.analyze(comments_df)
            chunked_df = self.video_sentiment.analyze(chunked_df)

            # ✅ CRITICAL FIX: CLEAN DATA
            comments_df = clean_dataframe(comments_df)
            chunked_df = clean_dataframe(chunked_df)

            # STEP 4: Insights
            chunked_df = self.cognitive.generate(chunked_df)
            chunked_df = self.virality.score(chunked_df)

            # Clean again after transformations
            chunked_df = clean_dataframe(chunked_df)

            top_segments = self.virality.select_top(chunked_df, top_k=5)

            # STEP 5: Metrics
            video_sent = safe_float(chunked_df['sentiment_score'].mean())
            comment_sent = safe_float(comments_df['sentiment_score'].mean())

            total = len(comments_df)
            if total == 0:
                return {"error": "No comments to analyze"}

            distribution = {
                "positive": safe_float((comments_df['sentiment_score'] > 0).sum() / total),
                "neutral": safe_float((comments_df['sentiment_score'] == 0).sum() / total),
                "negative": safe_float((comments_df['sentiment_score'] < 0).sum() / total),
            }

            # STEP 6: LLM
            insight = self.llm.analyze(
                chunked_df,
                comments_df,
                video_sent,
                comment_sent
            )

            # STEP 7: Convert safely
            timeline_data = clean_dataframe(chunked_df).to_dict(orient="records")
            comments_sample = clean_dataframe(comments_df.head(10)).to_dict(orient="records")

            result = {
                "video_id": video_id,
                "metrics": {
                    "video_sentiment": video_sent,
                    "comments_sentiment": comment_sent
                },
                "distribution": distribution,
                "top_segments": top_segments,
                "insight": insight,
                "timeline_data": timeline_data,
                "comments_sample": comments_sample
            }

            # Save to Mongo
            mongo_id = self.db.save_analysis(user_id, result)
            result["db_id"] = mongo_id

            return convert_objectid(result)

        except Exception as e:
            return {"error": str(e)}