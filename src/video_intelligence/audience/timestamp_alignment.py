class TimestampAligner:
    def align(self, comments_df, chunked_df):
        """
        Assigns each comment to a video 'chunk' based on its timestamp.
        """
        if comments_df.empty: return chunked_df
        
        # Aggregate sentiment of comments for each chunk
        chunked_df['audience_sentiment'] = 0.0
        
        for idx, row in chunked_df.iterrows():
            start, end = row['start'], row['start'] + 30 # assuming 30s chunks
            relevant = comments_df[
                (comments_df['mentioned_timestamp'] >= start) & 
                (comments_df['mentioned_timestamp'] < end)
            ]
            if not relevant.empty:
                chunked_df.at[idx, 'audience_sentiment'] = relevant['sentiment_score'].mean()
                
        return chunked_df