import re
import pandas as pd

def extract_timestamps(text):
    # Finds formats like 1:23, 10:45, or 1:23:45
    pattern = r'\b(\d{1,2}:)?(\d{1,2}):(\d{2})\b'
    match = re.search(pattern, text)
    if match:
        parts = match.group(0).split(':')
        if len(parts) == 3: # HH:MM:SS
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
        return int(parts[0]) * 60 + int(parts[1]) # MM:SS
    return None

class CommentsPreprocessor:
    def process(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty: return df
        
        # Extract timestamp mentioned in comment
        df['mentioned_timestamp'] = df['text'].apply(extract_timestamps)
        
        # Clean text for sentiment analysis
        df['clean_text'] = df['text'].str.replace(r'http\S+', '', regex=True).str.lower()
        return df