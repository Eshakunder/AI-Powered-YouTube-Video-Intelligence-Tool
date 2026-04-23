import pandas as pd

class CognitiveTimeline:
    def generate_timeline(self, chunked_df):
        """
        Uses existing data to find 'High Intensity' zones without using an LLM.
        """
        timeline = []
        for idx, row in chunked_df.iterrows():
            # Intensity = High Word Count + High Sentiment Magnitude
            word_count = len(row['clean_text'].split())
            intensity = word_count * abs(row['sentiment_score'])
            
            timeline.append({
                "start": row['start'],
                "intensity_score": round(intensity, 2),
                "label": "Peak" if intensity > chunked_df['sentiment_score'].mean() * 1.5 else "Stable"
            })
        return timeline