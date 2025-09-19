import unicodedata
import string
import emoji
import httpx
import asyncio
from app.core.config import settings


def preprocess(text: str) -> str:
    text = unicodedata.normalize('NFKC', text)
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text.strip()


def emoji_toxic(text: str):
    toxic_emojis = {"💩", "🤬", "😡", "😠"}
    found = emoji.emoji_list(text)
    for item in found:
        emj = item['emoji']
        if emj in toxic_emojis:
            return "toxic", 1.0
    return None, 0.0


def emoji_sentiment(text: str):
    emoji_map = {
        "😊": ("positive", 1.0),
        "😀": ("positive", 1.0),
        "😃": ("positive", 1.0),
        "😄": ("positive", 1.0),
        "😍": ("positive", 1.0),
        "🥰": ("positive", 1.0),
        "😂": ("positive", 0.8),
        "😭": ("negative", 0.8),
        "😢": ("negative", 0.8),
        "😞": ("negative", 1.0),
        "😡": ("negative", 1.0),
        "😠": ("negative", 1.0),
        "😔": ("negative", 0.8),
        "😐": ("neutral", 0.7),
        "😶": ("neutral", 0.7)
    }
    found = emoji.emoji_list(text)
    for item in found:
        emj = item['emoji']
        if emj in emoji_map:
            return emoji_map[emj]
    return None, 0.0


def map_sentiment_label(label: str):
    label_map = {
        "LABEL_0": "negative",
        "LABEL_1": "positive",
        "LABEL_2": "neutral",
        "0": "negative",
        "1": "positive",
        "2": "neutral",
        "NEG": "negative",
        "POS": "positive",
        "NEU": "neutral"
    }
    return label_map.get(label, label.lower() if label.isalpha() else label)


async def query_model(client, model: str, text: str):
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    try:
        response = await client.post(url, json={"inputs": text}, headers=headers, timeout=10.0)
        return response.json()
    except Exception as e:
        print(f"[WARN] Model {model} failed: {e}")
        return None


async def moderate_text(text: str):
    clean_text = preprocess(text)

    # Emoji check first
    emoji_label, emoji_score = emoji_toxic(clean_text)
    if emoji_label:
        return emoji_label, emoji_score

    models = [
        "unitary/toxic-bert",
        "Hate-speech-CNERG/bert-base-uncased-hate-speech",
        "Hate-speech-CNERG/dehatebert-mono-english",
        "cointegrated/rubert-toxic-pikabu"
    ]

    label_weights = {"toxic": 0.0, "not-toxic": 0.0}
    success_count = 0

    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(
            *[query_model(client, m, clean_text) for m in models]
        )

    for result in results:
        if not result:
            continue
        first = result[0] if isinstance(result, list) else None
        if isinstance(first, list) and first:
            first = first[0]
        if isinstance(first, dict):
            label = first.get("label", "not-toxic")
            score = first.get("score", 0)
            threshold = 0.7
            if label.lower() == "toxic" and score >= threshold:
                label_weights["toxic"] += score
            else:
                label_weights["not-toxic"] += score
            success_count += 1

    if success_count == 0:
        return "not-toxic", 0.0

    final_label = max(label_weights, key=label_weights.get)
    final_score = label_weights[final_label] / success_count
    return final_label, final_score


async def ensemble_mood(text: str):
    clean_text = preprocess(text)

    # Emoji check first
    emoji_label, emoji_score = emoji_sentiment(clean_text)
    if emoji_label:
        return emoji_label, emoji_score

    models = [
        "distilroberta-base",
        "cardiffnlp/twitter-roberta-base-sentiment",
        "finiteautomata/bertweet-base-sentiment-analysis"
    ]

    label_weights = {"positive": 0.0, "negative": 0.0, "neutral": 0.0}
    success_count = 0

    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(
            *[query_model(client, m, clean_text) for m in models]
        )

    for result in results:
        if not result:
            continue
        first = result[0] if isinstance(result, list) else None
        if isinstance(first, list) and first:
            first = first[0]
        if isinstance(first, dict):
            raw_label = first.get("label", "neutral")
            label = map_sentiment_label(raw_label)
            score = first.get("score", 0)
            if label in label_weights:
                label_weights[label] += score
            success_count += 1

    if success_count == 0:
        return "neutral", 0.0

    final_label = max(label_weights, key=label_weights.get)
    final_score = label_weights[final_label] / success_count
    return final_label, final_score
