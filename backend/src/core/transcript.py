from youtube_transcript_api import YouTubeTranscriptApi
import pandas as pd

def fetch_transcript(video_id: str) -> pd.DataFrame:
    api = YouTubeTranscriptApi()
    transcript = api.fetch(video_id)
    return pd.DataFrame(transcript)