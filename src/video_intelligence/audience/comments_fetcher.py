import yt_dlp
import pandas as pd

class CommentsFetcher:
    def __init__(self, max_comments=100):
        self.max_comments = max_comments

    def fetch(self, video_id: str) -> pd.DataFrame:
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        ydl_opts = {
            'getcomments': True,
            'skip_download': True,
            'quiet': True,
            'extract_flat': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(video_url, download=False)
                comments = info.get('comments', [])
                
                data = []
                for c in comments[:self.max_comments]:
                    data.append({
                        'comment_id': c.get('id'),
                        'text': c.get('text'),
                        'author': c.get('author'),
                        'like_count': c.get('like_count', 0),
                        'parent': c.get('parent', 'root')
                    })
                return pd.DataFrame(data)
            except Exception as e:
                print(f"Error fetching comments: {e}")
                return pd.DataFrame()