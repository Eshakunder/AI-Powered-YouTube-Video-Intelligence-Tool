import numpy as np

class CognitiveTimeline:
    def generate(self, df):
        """
        Generate cognitive features from transcript chunks
        Requires:
        - clean_text
        - sentiment_score
        - smoothed_sentiment
        - start
        """

        df = df.copy()

        # -----------------------------
        # BASIC FEATURES
        # -----------------------------
        df['word_count'] = df['clean_text'].apply(lambda x: len(x.split()))

        df['intensity'] = df['word_count'] * df['sentiment_score'].abs()

        # -----------------------------
        # SENTIMENT CHANGE (spike detector)
        # -----------------------------
        df['sentiment_delta'] = df['smoothed_sentiment'].diff().fillna(0)

        # -----------------------------
        # SPEECH RATE (proxy)
        # -----------------------------
        df['speech_rate'] = df['word_count'] / (df['word_count'].rolling(2).mean().fillna(1))

        # -----------------------------
        # NORMALIZATION (important!)
        # -----------------------------
        for col in ['intensity', 'sentiment_delta', 'speech_rate']:
            df[col] = (df[col] - df[col].mean()) / (df[col].std() + 1e-6)

        return df