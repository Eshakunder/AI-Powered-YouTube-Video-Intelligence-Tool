from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled
import pandas as pd


def fetch_transcript(video_id: str) -> pd.DataFrame:
    try:
        api = YouTubeTranscriptApi()

        # ONLY English transcripts
        transcript = api.fetch(video_id, languages=['en'])

        df = pd.DataFrame(transcript)

        if df.empty:
            raise ValueError("Transcript is empty")

        return df

    except NoTranscriptFound:
        raise ValueError("❌ No English transcript available")

    except TranscriptsDisabled:
        raise ValueError("❌ Transcripts are disabled for this video")

    except Exception as e:
        raise ValueError(f"❌ Transcript fetch error: {str(e)}")