import pandas as pd

class ShortsGenerator:
    def __init__(self):
        self.max_short_duration = 60  # seconds

    def define_manifest(self, viral_segments, chunked_df):
        """
        Creates a 'Manifest' (a blueprint) for each short.
        """
        shorts_manifest = []
        
        for segment in viral_segments:
            start_time = segment['time']
            # Find the text associated with this timestamp
            segment_data = chunked_df[chunked_df['start'] == start_time].iloc[0]
            
            manifest = {
                "short_id": f"short_{int(start_time)}",
                "timestamp": f"{start_time}s - {start_time + 30}s",
                "raw_text": segment_data['clean_text'],
                "viral_score": segment['score'],
                "suggested_title": segment['suggested_title'],
                "platform": "YouTube Shorts / TikTok"
            }
            shorts_manifest.append(manifest)
            
        return shorts_manifest