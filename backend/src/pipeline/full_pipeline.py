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

import os
import sys

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


# Load models once
validator = InputValidator()
fetcher = CommentsFetcher(max_comments=50)
processor = CommentsPreprocessor()

comment_model = CommentsSentiment()
video_model = VideoSentiment()

cognitive = CognitiveTimeline()
scorer = ViralityScorer()

llm = VideoInsightsAnalyzer()


def run():
    video_id = "2cK2P8Y63E8"

    print("\n🚀 STEP 1: Transcript")
    df = fetch_transcript(video_id)

    is_valid, msg = validator.validate(video_id, df)
    print(msg)
    if not is_valid:
        return

    chunked_df = preprocess(df)

    print("\n💬 STEP 2: Comments")
    comments_df = fetcher.fetch(video_id)

    if comments_df.empty:
        print("❌ No comments")
        return

    comments_df = processor.process(comments_df)

    print("\n🧠 STEP 3: Sentiment")
    comments_df = comment_model.analyze(comments_df)
    chunked_df = video_model.analyze(chunked_df)

    print("\n📈 STEP 4: Insights")
    chunked_df = cognitive.generate(chunked_df)
    chunked_df = scorer.score(chunked_df)

    top_segments = scorer.select_top(chunked_df, top_k=5)

    print("\n🔥 TOP SEGMENTS:")
    for seg in top_segments:
        print(seg)

    video_sent = chunked_df['sentiment_score'].mean()
    comment_sent = comments_df['sentiment_score'].mean()

    print("\n📊 Sentiment:")
    print("Video:", video_sent)
    print("Comments:", comment_sent)

    print("\n⚡ STEP 5: LLM Insight")
    insight = llm.analyze(
        chunked_df,
        comments_df,
        video_sent,
        comment_sent
    )

    print("\n🧠 FINAL INSIGHT:")
    print(insight)


if __name__ == "__main__":
    run()