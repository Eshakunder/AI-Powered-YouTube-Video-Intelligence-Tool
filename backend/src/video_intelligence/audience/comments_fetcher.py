# from youtube_comment_downloader import YoutubeCommentDownloader
# import pandas as pd
# import random


# class CommentsFetcher:
#     def __init__(self, max_comments=100, pool_size=400):
#         self.max_comments = max_comments
#         self.pool_size = pool_size
#         self.downloader = YoutubeCommentDownloader()

#     def fetch(self, video_id: str) -> pd.DataFrame:
#         url = f"https://www.youtube.com/watch?v={video_id}"

#         try:
#             comments_gen = self.downloader.get_comments_from_url(url)

#             pool = []
#             for i, comment in enumerate(comments_gen):
#                 if i >= self.pool_size:
#                     break

#                 pool.append({
#                     "comment_id": comment.get("cid"),
#                     "text": comment.get("text"),
#                     "author": comment.get("author"),
#                     "like_count": comment.get("votes", 0),
#                     "parent": "root"
#                 })

#             if not pool:
#                 return pd.DataFrame()

#             df = pd.DataFrame(pool)

#             # 🔥 Ensure numeric like_count
#             df['like_count'] = pd.to_numeric(df['like_count'], errors='coerce').fillna(0)

#             # -----------------------------
#             # STRATIFIED SAMPLING
#             # -----------------------------

#             # 1. Top liked (30%)
#             top_n = int(self.max_comments * 0.3)
#             top_df = df.sort_values(by='like_count', ascending=False).head(top_n)

#             # 2. Random (40%)
#             random_n = int(self.max_comments * 0.4)
#             remaining_df = df.drop(top_df.index)
#             random_df = remaining_df.sample(n=min(random_n, len(remaining_df)), random_state=42)

#             # 3. Recent/early (30%)
#             recent_n = self.max_comments - (len(top_df) + len(random_df))
#             recent_df = df.head(recent_n)

#             # Combine all
#             final_df = pd.concat([top_df, random_df, recent_df])

#             # Remove duplicates if any
#             final_df = final_df.drop_duplicates(subset='comment_id')

#             # Shuffle final result
#             final_df = final_df.sample(frac=1).reset_index(drop=True)

#             return final_df

#         except Exception as e:
#             print(f"Error fetching comments: {e}")
#             return pd.DataFrame()
        

# import pandas as pd
# import random
# import time
# import yt_dlp

# class CommentsFetcher:
#     def __init__(self, max_comments=100, pool_size=400):
#         self.max_comments = max_comments
#         self.pool_size = pool_size
#         # Mimicking a standard macOS Chrome browser
#         self.user_agent = (
#             "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
#             "AppleWebKit/537.36 (KHTML, like Gecko) "
#             "Chrome/122.0.0.0 Safari/537.36"
#         )

#     def fetch(self, video_id: str) -> pd.DataFrame:
#         url = f"https://www.youtube.com/watch?v={video_id}"
        
#         # Configure yt-dlp options for stealth
#         ydl_opts = {
#             'getcomments': True,
#             'quiet': True,
#             'no_warnings': True,
#             'user_agent': self.user_agent,
#             'max_comments': self.pool_size,
#             'extract_flat': False, # Ensure we get the full page data
#         }

#         try:
#             print(f"🕵️ Fetching comments using User-Agent: {video_id}...")
            
#             # Artificial human-like delay before starting
#             time.sleep(random.uniform(2, 5))

#             with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#                 # extract_info fetches the metadata and the comments list
#                 info = ydl.extract_info(url, download=False)
#                 raw_comments = info.get('comments', [])

#             if not raw_comments:
#                 print("⚠️ No comments retrieved. Check if video is restricted or IP is still blocked.")
#                 return pd.DataFrame()

#             pool = []
#             for comment in raw_comments:
#                 pool.append({
#                     "comment_id": comment.get("id"),
#                     "text": comment.get("text"),
#                     "author": comment.get("author"),
#                     "like_count": comment.get("like_count", 0),
#                     "parent": "root"
#                 })

#             df = pd.DataFrame(pool)
#             df['like_count'] = pd.to_numeric(df['like_count'], errors='coerce').fillna(0)

#             # --- STRATIFIED SAMPLING (Keeping your original logic) ---
#             # 1. Top liked (30%)
#             top_n = int(self.max_comments * 0.3)
#             top_df = df.sort_values(by='like_count', ascending=False).head(top_n)

#             # 2. Random (40%)
#             random_n = int(self.max_comments * 0.4)
#             remaining_df = df.drop(top_df.index)
#             random_df = remaining_df.sample(n=min(random_n, len(remaining_df)), random_state=42)

#             # 3. Recent (30%)
#             recent_n = self.max_comments - (len(top_df) + len(random_df))
#             recent_df = df.head(recent_n)

#             final_df = pd.concat([top_df, random_df, recent_df]).drop_duplicates(subset='comment_id')
#             return final_df.sample(frac=1).reset_index(drop=True)

#         except Exception as e:
#             print(f"💥 Error fetching comments with yt-dlp: {e}")
#             return pd.DataFrame()



import pandas as pd
import random
import time
from youtube_comment_downloader import YoutubeCommentDownloader

class CommentsFetcher:
    def __init__(self, max_comments=100, pool_size=400):
        self.max_comments = max_comments
        self.pool_size = pool_size
        # Step 1: Initialize with a standard User-Agent
        self.downloader = YoutubeCommentDownloader()

    def fetch(self, video_id: str) -> pd.DataFrame:
        url = f"https://www.youtube.com/watch?v={video_id}"

        try:
            # Step 2: Add a human-like delay before the request
            # This waits between 2 and 5 seconds randomly
            wait_time = random.uniform(2, 5)
            print(f"Waiting for {wait_time:.2f} seconds to avoid IP block...")
            time.sleep(wait_time)

            comments_gen = self.downloader.get_comments_from_url(url)

            pool = []
            for i, comment in enumerate(comments_gen):
                if i >= self.pool_size:
                    break

                pool.append({
                    "comment_id": comment.get("cid"),
                    "text": comment.get("text"),
                    "author": comment.get("author"),
                    "like_count": comment.get("votes", 0),
                    "parent": "root"
                })

            if not pool:
                return pd.DataFrame()

            df = pd.DataFrame(pool)
            df['like_count'] = pd.to_numeric(df['like_count'], errors='coerce').fillna(0)

            # --- STRATIFIED SAMPLING ---
            # 1. Top liked (30%)
            top_n = int(self.max_comments * 0.3)
            top_df = df.sort_values(by='like_count', ascending=False).head(top_n)

            # 2. Random (40%)
            random_n = int(self.max_comments * 0.4)
            remaining_df = df.drop(top_df.index)
            random_df = remaining_df.sample(n=min(random_n, len(remaining_df)), random_state=42)

            # 3. Recent/early (30%)
            recent_n = self.max_comments - (len(top_df) + len(random_df))
            recent_df = df.head(recent_n)

            # Combine and clean
            final_df = pd.concat([top_df, random_df, recent_df])
            final_df = final_df.drop_duplicates(subset='comment_id')
            
            # Final Shuffle
            return final_df.sample(frac=1).reset_index(drop=True)

        except Exception as e:
            print(f"Error fetching comments: {e}")
            return pd.DataFrame()