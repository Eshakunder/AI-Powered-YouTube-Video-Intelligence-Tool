# import yt_dlp
# from youtube_transcript_api import YouTubeTranscriptApi
# import pandas as pd

# # -----------------------------
# # CONFIG
# # -----------------------------

# BLOCKED_PHRASES = [
#     "official music video",
#     "lyrics video",
#     "full album",
#     "remix version"
# ]

# MIN_DURATION = 120          # seconds
# MIN_WORDS = 80
# MIN_UNIQUE_RATIO = 0.12


# # -----------------------------
# # STEP 1: FETCH METADATA
# # -----------------------------

# def fetch_metadata(video_url: str) -> dict:
#     ydl_opts = {'quiet': True, 'no_warnings': True}

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(video_url, download=False)

#     return {
#         "duration": info.get("duration", 0),
#         "title": info.get("title", "").lower(),
#         "description": info.get("description", "").lower()
#     }


# # -----------------------------
# # STEP 2: DURATION CHECK
# # -----------------------------

# def validate_duration(metadata: dict):
#     if metadata["duration"] < MIN_DURATION:
#         return False, "Rejected: Video too short"
#     return True, "Duration valid"


# # -----------------------------
# # STEP 3: KEYWORD CHECK
# # -----------------------------

# def validate_keywords(metadata: dict):
#     title = metadata["title"]

#     for phrase in BLOCKED_PHRASES:
#         if phrase in title:
#             return False, f"Rejected: Contains '{phrase}'"

#     return True, "Keyword check passed"


# # -----------------------------
# # STEP 4: FETCH TRANSCRIPT
# # -----------------------------

# def fetch_transcript(video_id: str) -> pd.DataFrame:
#     api = YouTubeTranscriptApi()
#     transcript = api.fetch(video_id)
#     return pd.DataFrame(transcript)


# # -----------------------------
# # STEP 5: TRANSCRIPT VALIDATION
# # -----------------------------

# def validate_transcript(df: pd.DataFrame):
#     full_text = " ".join(df['text']).lower()
#     words = full_text.split()

#     if len(words) < MIN_WORDS:
#         return False, "Too little spoken content"

#     unique_ratio = len(set(words)) / len(words) if words else 0

#     # repetition detection
#     word_counts = {}
#     for w in words:
#         word_counts[w] = word_counts.get(w, 0) + 1

#     max_freq_ratio = max(word_counts.values()) / len(words)

#     # Reject only if clearly repetitive
#     if unique_ratio < MIN_UNIQUE_RATIO and max_freq_ratio > 0.2:
#         return False, "Likely repetitive (music/lyrics)"

#     return True, "Transcript valid"


# # -----------------------------
# # MAIN FUNCTION
# # -----------------------------

# def validate_and_fetch(video_id: str) -> pd.DataFrame:
#     video_url = f"https://www.youtube.com/watch?v={video_id}"

#     # Metadata
#     metadata = fetch_metadata(video_url)

#     ok, msg = validate_duration(metadata)
#     if not ok:
#         raise ValueError(msg)

#     ok, msg = validate_keywords(metadata)
#     if not ok:
#         raise ValueError(msg)

#     # Transcript
#     df = fetch_transcript(video_id)

#     ok, msg = validate_transcript(df)
#     if not ok:
#         raise ValueError(msg)

#     return df

import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound
import pandas as pd

# -----------------------------
# CONFIG
# -----------------------------

BLOCKED_PHRASES = [
    "official music video",
    "lyrics video",
    "full album",
    "remix version"
]

MIN_DURATION = 120          # seconds
MIN_WORDS = 80
MIN_UNIQUE_RATIO = 0.12


# -----------------------------
# STEP 1: FETCH METADATA
# -----------------------------

def fetch_metadata(video_url: str) -> dict:
    ydl_opts = {'quiet': True, 'no_warnings': True}

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)

    return {
        "duration": info.get("duration", 0),
        "title": info.get("title", "").lower(),
        "description": info.get("description", "").lower()
    }


# -----------------------------
# STEP 2: DURATION CHECK
# -----------------------------

def validate_duration(metadata: dict):
    if metadata["duration"] < MIN_DURATION:
        return False, "❌ Rejected: Video too short"
    return True, "Duration valid"


# -----------------------------
# STEP 3: KEYWORD CHECK
# -----------------------------

def validate_keywords(metadata: dict):
    title = metadata["title"]

    for phrase in BLOCKED_PHRASES:
        if phrase in title:
            return False, f"❌ Rejected: Contains '{phrase}'"

    return True, "Keyword check passed"


# -----------------------------
# STEP 4: FETCH TRANSCRIPT (FIXED)
# -----------------------------

def fetch_transcript(video_id: str) -> pd.DataFrame:
    api = YouTubeTranscriptApi()

    try:
        # Only accept English transcripts
        transcript = api.fetch(video_id, languages=['en'])
        return pd.DataFrame(transcript)

    except NoTranscriptFound:
        raise ValueError(
            "❌ Video rejected: No English transcript available "
            "(only non-English subtitles found)"
        )


# -----------------------------
# STEP 5: TRANSCRIPT VALIDATION
# -----------------------------

def validate_transcript(df: pd.DataFrame):
    full_text = " ".join(df['text']).lower()
    words = full_text.split()

    if len(words) < MIN_WORDS:
        return False, "❌ Rejected: Too little spoken content"

    unique_ratio = len(set(words)) / len(words) if words else 0

    # repetition detection
    word_counts = {}
    for w in words:
        word_counts[w] = word_counts.get(w, 0) + 1

    max_freq_ratio = max(word_counts.values()) / len(words)

    # Reject only if clearly repetitive
    if unique_ratio < MIN_UNIQUE_RATIO and max_freq_ratio > 0.2:
        return False, "❌ Rejected: Likely repetitive (music/lyrics)"

    return True, "Transcript valid"


# -----------------------------
# MAIN FUNCTION (FIXED)
# -----------------------------

def validate_and_fetch(video_id: str) -> pd.DataFrame:
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        # Step 1: Metadata
        metadata = fetch_metadata(video_url)

        ok, msg = validate_duration(metadata)
        if not ok:
            raise ValueError(msg)

        ok, msg = validate_keywords(metadata)
        if not ok:
            raise ValueError(msg)

        # Step 2: Transcript
        df = fetch_transcript(video_id)

        ok, msg = validate_transcript(df)
        if not ok:
            raise ValueError(msg)

        return df

    except ValueError as e:
        print(e)
        return None