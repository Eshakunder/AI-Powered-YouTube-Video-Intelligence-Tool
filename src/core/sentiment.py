from transformers import pipeline

label_map = {
    "LABEL_0": "negative",
    "LABEL_1": "neutral",
    "LABEL_2": "positive"
}

score_map = {
    "positive": 1,
    "neutral": 0,
    "negative": -1
}

sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

def analyze_sentiment(chunked):
    texts = chunked['clean_text'].str.slice(0, 512).tolist()
    results = sentiment_model(texts, batch_size=16)

    chunked['sentiment'] = [label_map[r['label']] for r in results]
    chunked['sentiment_score'] = chunked['sentiment'].map(score_map)

    return chunked