import json
from src.video_intelligence.validation.input_validator import InputValidator
from src.pipeline.full_pipeline import FullIntelligencePipeline

class RunManager:
    def __init__(self, comment_fetcher_instance):
        """
        comment_fetcher_instance: An external tool/utility to get 
        comments without using the core folder.
        """
        self.validator = InputValidator()
        self.pipeline = FullIntelligencePipeline()
        self.fetcher = comment_fetcher_instance

    def execute(self, video_id: str):
        # 1. Validate Input (Using your existing validator)
        print(f"🚀 Starting Analysis for Video ID: {video_id}")
        is_valid, message, _ = self.validator.run_all_checks(video_id)
        
        if not is_valid:
            print(f"❌ Aborted: {message}")
            return {"status": "error", "message": message}

        try:
            # 2. Get Comments
            comments_df = self.fetcher.get_comments(video_id)

            # 3. Trigger Intelligence Pipeline
            final_data = self.pipeline.run(video_id, comments_df)

            print("✅ Analysis Complete!")
            return {"status": "success", "results": final_data}

        except Exception as e:
            print(f"💥 Pipeline Failure: {str(e)}")
            return {"status": "error", "message": str(e)}

# --- TESTING SECTION ---
if __name__ == "__main__":
    # Placeholder for your comment fetching logic
    class MockFetcher:
        def get_comments(self, vid): return None # Replace with actual API call
    
    # 📍 PUT YOUR VIDEO ID HERE FOR TESTING
    TEST_VIDEO_ID = "INSERT_VIDEO_ID_HERE" 
    
    manager = RunManager(comment_fetcher_instance=MockFetcher())
    output = manager.execute(TEST_VIDEO_ID)
    
    # Outputting as JSON to see exactly what the Frontend will receive
    if output["status"] == "success":
        print(json.dumps(output["results"], indent=2))