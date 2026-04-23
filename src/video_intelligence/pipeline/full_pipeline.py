import pandas as pd
# Import your new preprocessing logic
from src.video_intelligence.preprocessing.transcript import fetch_transcript
from src.video_intelligence.preprocessing.data_cleaning import preprocess

# Import Intelligence & Generation modules
from src.video_intelligence.audience.comments_sentiment import CommentsSentiment
from src.video_intelligence.audience.timestamp_alignment import TimestampAligner
from src.video_intelligence.insights.hook_analyzer import HookAnalyzer
from src.video_intelligence.insights.cognitive_timeline import CognitiveTimeline
from src.video_intelligence.insights.virality_engine import ViralityEngine
from src.video_intelligence.generation.shorts_generator import ShortsGenerator

class FullIntelligencePipeline:
    def __init__(self):
        self.sentiment_engine = CommentsSentiment()
        self.aligner = TimestampAligner()
        self.hook_engine = HookAnalyzer()
        self.timeline_engine = CognitiveTimeline()
        self.virality_engine = ViralityEngine()
        self.shorts_engine = ShortsGenerator()

    def run(self, video_id, comments_df):
        # 1. Internal Preprocessing (Using your new files)
        print("📥 Fetching Transcript...")
        raw_df = fetch_transcript(video_id)
        
        print("🧹 Cleaning and Chunking Data...")
        processed_df = preprocess(raw_df, chunk_size=30)

        # 2. Intelligence Analysis
        print("🧠 Analyzing Video Intelligence...")
        comment_data = self.sentiment_engine.analyze(comments_df)
        aligned_df = self.aligner.align(processed_df, comment_data)
        
        # 3. Generating Insights
        report = {
            "hook": self.hook_engine.analyze(aligned_df),
            "pacing": self.timeline_engine.generate_timeline(aligned_df),
            "viral_moments": self.virality_engine.predict_viral_segments(aligned_df)
        }

        # 4. Creating Assets
        shorts = self.shorts_engine.define_manifest(report["viral_moments"], aligned_df)

        return {
            "video_id": video_id,
            "time_series": aligned_df.to_dict(orient="records"),
            "insights": report,
            "shorts": shorts
        }