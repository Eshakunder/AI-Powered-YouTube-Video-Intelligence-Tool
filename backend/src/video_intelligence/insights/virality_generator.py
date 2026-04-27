import numpy as np

class ViralityScorer:
    def __init__(self):
        # weights → tweak later
        self.weights = {
            "intensity": 0.4,
            "sentiment_delta": 0.3,
            "speech_rate": 0.2,
            "sentiment": 0.1
        }

    def score(self, df):
        """
        Compute virality score using cognitive features
        """

        df = df.copy()

        df['virality_score'] = (
            self.weights['intensity'] * df['intensity'] +
            self.weights['sentiment_delta'] * df['sentiment_delta'].abs() +
            self.weights['speech_rate'] * df['speech_rate'] +
            self.weights['sentiment'] * df['sentiment_score'].abs()
        )

        # Normalize score
        df['virality_score'] = (
            df['virality_score'] - df['virality_score'].min()
        ) / (df['virality_score'].max() - df['virality_score'].min() + 1e-6)

        return df

    def select_top(self, df, top_k=5, min_gap=3):
        """
        Select top viral segments with spacing (avoid overlap)
        """

        df = df.sort_values(by="virality_score", ascending=False).reset_index(drop=True)

        selected = []
        used_indices = set()

        for idx, row in df.iterrows():
            if len(selected) >= top_k:
                break

            # enforce spacing
            if any(abs(idx - u) < min_gap for u in used_indices):
                continue

            selected.append({
                "start": row['start'],
                "text": row['clean_text'],
                "score": round(row['virality_score'], 3)
            })

            used_indices.add(idx)

        return selected