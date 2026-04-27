# from preprocessing import preprocess
# from sentiment import analyze_sentiment
# from topic import add_topics
# from attention import process_attention
# from validation import validate_and_fetch
# from visualization import (
#     plot_sentiment,
#     plot_smoothed_sentiment,
#     plot_attention,
#     plot_topics
# )

# def run_pipeline(video_id: str):
#     # ✅ already returns transcript dataframe
#     df = validate_and_fetch(video_id)

#     chunked = preprocess(df)

#     chunked = analyze_sentiment(chunked)
#     chunked = add_topics(chunked)
#     chunked = process_attention(chunked)

#     return chunked


# if __name__ == "__main__":
#     video_id = "XrGhz0bVh-w"

#     try:
#         chunked = run_pipeline(video_id)

#         print(chunked.head())

#         # Visualizations
#         plot_sentiment(chunked)
#         plot_smoothed_sentiment(chunked)
#         plot_attention(chunked)
#         plot_topics(chunked)

#     except ValueError as e:
#         print("❌ Validation failed:", e)
from backend.src.core.preprocessing import preprocess
from backend.src.core.sentiment import analyze_sentiment
from backend.src.core.topic import add_topics
from backend.src.core.attention import process_attention
from backend.src.core.validation import validate_and_fetch
from backend.src.core.visualization import (
    plot_sentiment,
    plot_smoothed_sentiment,
    plot_attention,
    plot_topics
)

def run_pipeline(video_id: str):
    # Step 1: Validate + fetch transcript
    df = validate_and_fetch(video_id)

    # 🔴 IMPORTANT: Stop if validation failed
    if df is None:
        return None

    # Step 2: Preprocessing
    chunked = preprocess(df)

    # Step 3: NLP pipeline
    chunked = analyze_sentiment(chunked)
    chunked = add_topics(chunked)
    chunked = process_attention(chunked)

    return chunked


if __name__ == "__main__":
    video_id = "2cK2P8Y63E8"

    chunked = run_pipeline(video_id)

    # 🔴 IMPORTANT: Handle invalid case
    if chunked is None:
        print("⚠️ Pipeline stopped due to invalid or unsupported video.")
        exit()

    print(chunked.head())

    # Visualizations
    plot_sentiment(chunked)
    plot_smoothed_sentiment(chunked)
    plot_attention(chunked)
    plot_topics(chunked)