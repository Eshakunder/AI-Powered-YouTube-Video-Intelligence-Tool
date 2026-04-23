from keybert import KeyBERT

kw_model = KeyBERT()

def extract_topic(text):
    keywords = kw_model.extract_keywords(text, top_n=1)
    return keywords[0][0] if keywords else None

def add_topics(chunked):
    chunked['topic'] = chunked['clean_text'].apply(extract_topic)
    return chunked