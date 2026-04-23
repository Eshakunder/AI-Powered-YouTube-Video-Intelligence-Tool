from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

def compute_attention(chunked):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(chunked['clean_text'])

    # Mean TF-IDF score per chunk
    attention_scores = tfidf_matrix.mean(axis=1)
    chunked['attention'] = np.array(attention_scores).flatten()

    return chunked


def normalize_attention(chunked):
    min_val = chunked['attention'].min()
    max_val = chunked['attention'].max()

    chunked['attention_norm'] = (
        (chunked['attention'] - min_val) / (max_val - min_val)
    )

    return chunked


# def detect_key_moments(chunked, threshold=0.02):
#     chunked['attention_diff'] = chunked['attention_norm'].diff().fillna(0)

#     chunked['is_key_moment'] = chunked['attention_diff'] > threshold

#     return chunked
def detect_key_moments(chunked):
    # Calculate the change in attention
    chunked['attention_diff'] = chunked['attention_norm'].diff().fillna(0)
    
    # DYNAMIC CALCULATION:
    # Threshold = Average Change + (Constant * Volatility)
    # 1.5 is a good starting multiplier for 'significant' moments
    threshold = chunked['attention_diff'].mean() + (chunked['attention_diff'].std() * 1.5)
    
    # Identify moments that exceed this specific video's threshold
    chunked['is_key_moment'] = chunked['attention_diff'] > threshold
    
    return chunked


def combine_signals(chunked):
    chunked['final_attention'] = (
        0.5 * chunked['attention_norm'] +
        0.3 * abs(chunked['sentiment_score']) +
        0.2 * chunked['attention_diff']
    )

    return chunked


def process_attention(chunked):
    chunked = compute_attention(chunked)
    chunked = normalize_attention(chunked)
    chunked = detect_key_moments(chunked)
    chunked = combine_signals(chunked)

    return chunked