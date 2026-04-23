class NarrativeAnalyzer:
    def analyze_structure(self, chunked_df):
        """
        Checks for topic consistency to determine if the video is organized.
        """
        unique_topics = chunked_df['topic'].nunique()
        total_chunks = len(chunked_df)
        
        # Logic: If topics change every chunk, it's 'Scattered'. 
        # If topics stay the same for 3+ chunks, it's 'Structured'.
        cohesion_score = 1 - (unique_topics / total_chunks)
        
        structure_type = "Linear/Structured" if cohesion_score > 0.6 else "Rapid/Fast-paced"
        
        return {
            "structure_type": structure_type,
            "cohesion_score": round(cohesion_score, 2),
            "total_segments": unique_topics
        }