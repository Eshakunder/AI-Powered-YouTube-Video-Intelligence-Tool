import yt_dlp
import pandas as pd


class InputValidator:
    def __init__(self):
        self.blocked_phrases = [
            "official music video",
            "lyrics video",
            "full album",
            "remix version"
        ]
        self.min_duration = 120  # seconds
        self.min_words = 80
        self.min_unique_ratio = 0.12

    def fetch_metadata(self, video_id: str) -> dict:
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        ydl_opts = {
            'quiet': True,
            'no_warnings': True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)

        return {
            "duration": info.get("duration", 0),
            "title": info.get("title", "").lower()
        }

    def validate(self, video_id: str, df: pd.DataFrame):
        """
        Validate video using:
        - metadata (duration + keywords)
        - transcript quality
        """

        try:
            # 🔹 1. Metadata validation
            metadata = self.fetch_metadata(video_id)

            if metadata["duration"] < self.min_duration:
                return False, "❌ Rejected: Video too short"

            for phrase in self.blocked_phrases:
                if phrase in metadata["title"]:
                    return False, f"❌ Rejected: Blocked keyword '{phrase}'"

            # 🔹 2. Transcript validation
            if df is None or df.empty:
                return False, "❌ Rejected: Empty transcript"

            # Ensure expected column exists
            if 'text' not in df.columns:
                return False, "❌ Invalid transcript format (missing 'text')"

            full_text = " ".join(df['text']).lower()
            words = full_text.split()

            if len(words) < self.min_words:
                return False, "❌ Rejected: Too little spoken content"

            # 🔥 Unique ratio
            unique_ratio = len(set(words)) / len(words) if words else 0

            # 🔥 Repetition detection (your strong logic)
            word_counts = {}
            for w in words:
                word_counts[w] = word_counts.get(w, 0) + 1

            max_freq_ratio = max(word_counts.values()) / len(words)

            if unique_ratio < self.min_unique_ratio and max_freq_ratio > 0.2:
                return False, "❌ Rejected: Likely repetitive (music/lyrics)"

            return True, "✅ Validation Passed"

        except Exception as e:
            return False, f"❌ Validation Error: {str(e)}"