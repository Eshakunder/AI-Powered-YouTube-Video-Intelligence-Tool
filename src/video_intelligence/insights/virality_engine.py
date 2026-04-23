class ViralityEngine:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def predict_viral_segments(self, chunked_df):
        # Math-based filtering: Find top 10% attention peaks
        threshold = chunked_df['attention_norm'].quantile(0.9)
        peaks = chunked_df[chunked_df['attention_norm'] >= threshold]
        
        results = []
        for _, row in peaks.iterrows():
            # LLM only used to write a catchy 'Shorts' title for the peak
            prompt = f"Give a 5-word viral title for this text: {row['clean_text'][:100]}"
            try:
                title = self.model.generate_content(prompt).text.strip()
            except:
                title = "Viral Moment"
                
            results.append({
                "time": row['start'],
                "score": row['attention_norm'],
                "suggested_title": title
            })
        return results