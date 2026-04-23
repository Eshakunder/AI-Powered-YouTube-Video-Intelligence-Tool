import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled
import pandas as pd

class InputValidator:
    def __init__(self):
        self.blocked_phrases = ["official music video", "lyrics video", "full album", "remix version"]
        self.min_duration = 120
        self.min_words = 80
        self.min_unique_ratio = 0.12

    def fetch_metadata(self, video_id: str) -> dict:
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        ydl_opts = {'quiet': True, 'no_warnings': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
        return {
            "duration": info.get("duration", 0),
            "title": info.get("title", "").lower()
        }

    def run_all_checks(self, video_id: str):
        try:
            # 1. Structural Check
            metadata = self.fetch_metadata(video_id)
            if metadata["duration"] < self.min_duration:
                return False, "❌ Rejected: Video too short", None
            
            for phrase in self.blocked_phrases:
                if phrase in metadata["title"]:
                    return False, f"❌ Rejected: Blocked keyword '{phrase}'", None

            # 2. Transcript Fetch
            api = YouTubeTranscriptApi()
            # We try fetching manual or auto-generated English transcripts
            transcript_list = api.list_transcripts(video_id)
            transcript = transcript_list.find_transcript(['en']).fetch()
            df = pd.DataFrame(transcript)

            # 3. Quality Check
            full_text = " ".join(df['text']).lower()
            words = full_text.split()
            if len(words) < self.min_words:
                return False, "❌ Rejected: Not enough spoken content", None

            unique_ratio = len(set(words)) / len(words) if words else 0
            if unique_ratio < self.min_unique_ratio:
                 return False, "❌ Rejected: Likely repetitive/music content", None

            return True, "✅ Validation Passed", df

        except (NoTranscriptFound, TranscriptsDisabled):
            return False, "❌ Rejected: No English transcripts available", None
        except Exception as e:
            return False, f"❌ Validation Error: {str(e)}", None