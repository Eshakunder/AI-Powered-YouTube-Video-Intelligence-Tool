import sys
import os

# Fix import path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))
# Core modules
from src.video_intelligence.preprocessing.transcript import fetch_transcript
from src.video_intelligence.preprocessing.data_cleaning import preprocess
from src.video_intelligence.validation.input_validation import InputValidator

# Audience modules
from src.video_intelligence.audience.comments_fetcher import CommentsFetcher
from src.video_intelligence.audience.comments_preprocess import CommentsPreprocessor
from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
from src.video_intelligence.audience.summary_generator import SummaryGenerator
from src.video_intelligence.audience.contradiction_analysis import ContradictionAnalyzer

# 🔥 NEW: Video sentiment
from src.video_intelligence.audience.video_sentiment import VideoSentiment


def run():
    video_id = "2cK2P8Y63E8"

    # -----------------------------
    # STEP 1: TRANSCRIPT
    # -----------------------------
    print("\n🚀 STEP 1: Fetch Transcript")
    try:
        df = fetch_transcript(video_id)
        print(f"✅ Transcript fetched: {df.shape}")
        print(df.head(5))
    except Exception as e:
        print(f"❌ Transcript Error: {e}")
        return

    # -----------------------------
    # STEP 2: VALIDATION
    # -----------------------------
    print("\n🔍 STEP 2: Validation")
    validator = InputValidator()
    is_valid, msg = validator.validate(video_id, df)
    print(msg)

    if not is_valid:
        return

    # -----------------------------
    # STEP 3: TRANSCRIPT PROCESSING
    # -----------------------------
    print("\n🔄 STEP 3: Preprocess Transcript")
    chunked_df = preprocess(df)
    print(f"✅ Chunked transcript: {chunked_df.shape}")

    # -----------------------------
    # STEP 4: FETCH COMMENTS
    # -----------------------------
    print("\n💬 STEP 4: Fetch Comments")
    fetcher = CommentsFetcher(max_comments=50)
    comments_df = fetcher.fetch(video_id)

    if comments_df.empty:
        print("❌ No comments fetched")
        return

    print(f"✅ Comments fetched: {len(comments_df)}")
    print(comments_df.head(5))

    # -----------------------------
    # STEP 5: PREPROCESS COMMENTS
    # -----------------------------
    print("\n🧹 STEP 5: Preprocess Comments")
    processor = CommentsPreprocessor()
    comments_df = processor.process(comments_df)

    print("✅ Comments cleaned")
    print(comments_df.head(5))

    # -----------------------------
    # STEP 6: COMMENT SENTIMENT
    # -----------------------------
    print("\n🧠 STEP 6: Comment Sentiment Analysis")

    sentiment_model = CommentsSentiment()
    comments_df = sentiment_model.analyze(comments_df)

    # ensure numeric
    comments_df['sentiment_score'] = (
        comments_df['sentiment_score']
        .astype(float)
    )

    print("✅ Comment sentiment computed")
    print(comments_df[['text', 'sentiment_score']].tail(5))

    # -----------------------------
    # STEP 7: VIDEO SENTIMENT
    # -----------------------------
    print("\n📈 STEP 7: Video Sentiment (Time Series)")

    video_model = VideoSentiment()
    chunked_df = video_model.analyze(chunked_df)

    print("✅ Video sentiment computed")
    print(chunked_df[['start', 'sentiment_score', 'smoothed_sentiment']].tail(10))

    # -----------------------------
    # STEP 8: GLOBAL SENTIMENT
    # -----------------------------
    print("\n📊 STEP 8: Global Sentiment")

    video_sentiment = chunked_df['sentiment_score'].mean()
    comments_sentiment = comments_df['sentiment_score'].mean()

    print(f"🎬 Video Sentiment: {video_sentiment:.3f}")
    print(f"💬 Comments Sentiment: {comments_sentiment:.3f}")
    print(f"⚡ Sentiment Gap: {video_sentiment - comments_sentiment:.3f}")

    # -----------------------------
    # STEP 9: SUMMARIES
    # -----------------------------
    print("\n🧠 STEP 9: Generate Summaries")

    summarizer = SummaryGenerator()

    video_summary = summarizer.summarize_video(chunked_df)
    comments_summary = summarizer.summarize_comments(comments_df)

    print("\n🎬 VIDEO SUMMARY:")
    print(video_summary)

    print("\n💬 COMMENTS SUMMARY:")
    print(comments_summary)

    # -----------------------------
    # STEP 10: CONTRADICTION ANALYSIS
    # -----------------------------
    print("\n⚡ STEP 10: Contradiction Analysis")

    analyzer = ContradictionAnalyzer()

    insight = analyzer.analyze(
        video_summary,
        comments_summary,
        video_sentiment,
        comments_sentiment
    )

    print("\n🧠 INSIGHT:")
    print(insight)

    # -----------------------------
    # STEP 11: COMMENT DISTRIBUTION
    # -----------------------------
    print("\n📊 STEP 11: Comment Distribution")

    total = len(comments_df)

    pos = (comments_df['sentiment_score'] > 0).sum() / total
    neg = (comments_df['sentiment_score'] < 0).sum() / total
    neu = (comments_df['sentiment_score'] == 0).sum() / total

    print(f"Positive: {pos:.2%}")
    print(f"Neutral : {neu:.2%}")
    print(f"Negative: {neg:.2%}")

    # -----------------------------
    # FINAL OUTPUT
    # -----------------------------
    print("\n📊 SAMPLE COMMENTS")
    print(comments_df[['text', 'sentiment_score', 'like_count']].head())

    print("\n📊 SAMPLE CHUNKS")
    print(chunked_df[['start', 'clean_text', 'sentiment_score', 'smoothed_sentiment']].head())


if __name__ == "__main__":
    run()