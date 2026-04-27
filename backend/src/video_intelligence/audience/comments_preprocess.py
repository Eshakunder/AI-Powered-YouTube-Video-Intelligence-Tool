import re
import pandas as pd


def extract_timestamps(text):
    pattern = r'\b(\d{1,2}:)?(\d{1,2}):(\d{2})\b'
    match = re.search(pattern, text)
    if match:
        parts = match.group(0).split(':')
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
        return int(parts[0]) * 60 + int(parts[1])
    return None


# 🔥 Emoji removal regex
def remove_emojis(text):
    if not isinstance(text, str):
        return text

    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map
        "\U0001F700-\U0001F77F"
        "\U0001F780-\U0001F7FF"
        "\U0001F800-\U0001F8FF"
        "\U0001F900-\U0001F9FF"  # supplemental symbols
        "\U0001FA00-\U0001FA6F"
        "\U0001FA70-\U0001FAFF"
        "\U00002700-\U000027BF"  # dingbats
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )

    return emoji_pattern.sub(r'', text)


class CommentsPreprocessor:
    def process(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df

        # ✅ Convert like_count to numeric
        df['like_count'] = pd.to_numeric(
            df['like_count'], errors='coerce'
        ).fillna(0)

        # ✅ Extract timestamps
        df['mentioned_timestamp'] = df['text'].apply(extract_timestamps)

        # ✅ Clean text (links + emojis + lowercase)
        df['clean_text'] = (
            df['text']
            .str.replace(r'http\S+', '', regex=True)
            .apply(remove_emojis)
            .str.lower()
        )

        return df