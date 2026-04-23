import matplotlib.pyplot as plt

def plot_sentiment(chunked):
    plt.figure(figsize=(12, 5))
    plt.plot(chunked['start'], chunked['sentiment_score'], marker='o')
    plt.title("Sentiment Timeline")
    plt.xlabel("Time (seconds)")
    plt.ylabel("Sentiment")
    plt.grid()
    plt.show()


def plot_smoothed_sentiment(chunked):
    chunked['smooth_sentiment'] = chunked['sentiment_score'].rolling(3).mean()

    plt.figure(figsize=(12, 5))
    plt.plot(chunked['start'], chunked['smooth_sentiment'])
    plt.title("Smoothed Sentiment")
    plt.grid()
    plt.show()


def plot_attention(chunked):
    plt.figure(figsize=(12, 5))

    plt.plot(chunked['start'], chunked['final_attention'], label='Attention')

    key_moments = chunked[chunked['is_key_moment']]

    plt.scatter(
        key_moments['start'],
        key_moments['final_attention'],
        color='red',
        label='Key Moments'
    )

    plt.title("🔥 Attention Graph (Key Moments Highlighted)")
    plt.xlabel("Time (seconds)")
    plt.ylabel("Attention")

    plt.legend()
    plt.grid()
    plt.show()


def plot_topics(chunked):
    topic_codes = {t: i for i, t in enumerate(chunked['topic'].unique())}
    chunked['topic_num'] = chunked['topic'].map(topic_codes)

    plt.figure(figsize=(12, 5))
    plt.scatter(chunked['start'], chunked['topic_num'])

    plt.yticks(list(topic_codes.values()), list(topic_codes.keys()))
    plt.title("Topic Timeline")
    plt.grid()
    plt.show()