import re
import pandas as pd

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub('\n', ' ', text)
    return text

def preprocess(df: pd.DataFrame, chunk_size: int = 30) -> pd.DataFrame:
    df['clean_text'] = df['text'].apply(clean_text)

    df['chunk'] = (df['start'] // chunk_size).astype(int)

    chunked = df.groupby('chunk').agg({
        'clean_text': ' '.join,
        'start': 'min'
    }).reset_index()

    return chunked