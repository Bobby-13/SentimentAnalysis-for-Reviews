import pandas as pd # type: ignore
import random
from django.http.response import HttpResponse # type: ignore
from django.http import JsonResponse # type: ignore
import tensorflow as tf # type: ignore
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification # type: ignore
import json
from textblob import TextBlob # type: ignore
from googletrans import Translator # type: ignore
import csv
from faker import Faker # type: ignore
import asyncio

def generate_random_text():
    languages = ['hi_IN', 'bn_BD', 'ta_IN']  
    lang = random.choice(languages)
    fake = Faker(lang)
    return fake.text()

def generate_csv_file(filename):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['userId', 'text']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for _ in range(100):
            random_id = Faker().uuid4()
            user_id = str(random_id)[:6]
            text = generate_random_text()
            writer.writerow({'userId': user_id, 'text': text})

def hello(request):
    # generate_csv_file('sample_data.csv')
    return HttpResponse("Hello world !!. .")


distil_berd_imdb = 'bert_models/Trained_DISTILBERT_Model_imdb' 
loaded_model = TFAutoModelForSequenceClassification.from_pretrained(distil_berd_imdb)
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
max_length = 200
labels = ["Negative", "Neutral", "Positive"]

def distil_bert_model(request):
    
    data = json.loads(request.body)
    
    sentence = data['sentence']
    language = data['language']
        
    text = text_translation(sentence)
    
    predicted_sentiment1 = predict_sentiment(text)
    response_data = {
        "Sentence": text,
        "Predicted_Sentiment": predicted_sentiment1,
    }
    
    return JsonResponse(response_data)
    
def text_translation(text):
    foreign_text = text
    english_text = translate_text(foreign_text)
    return english_text


def detect_sentiment(review):
    blob = TextBlob(review)
    sentiment = blob.sentiment.polarity
    if sentiment > 0:
        return "Positive"
    elif sentiment < 0:
        return "Negative"
    else:
        return "Positive"

def classify_sentiment(probabilities):
    positive_threshold = 0.8
    negative_threshold = 0.5
    positive_prob = probabilities[1]
    negative_prob = probabilities[0]
    
    if positive_prob >= positive_threshold:
        return "Positive"
    elif negative_prob >= negative_threshold:
        return "Negative"
    else:
        return "Neutral"

def predict_sentiment(sentence):
    encoded_sentence = tokenizer.encode_plus(sentence,
                                             add_special_tokens=True,
                                             max_length=max_length,
                                             truncation=True,
                                             padding='max_length',
                                             return_attention_mask=True,
                                             return_tensors='tf')

    predictions = loaded_model(encoded_sentence, training=False)
    probabilities = tf.nn.softmax(predictions.logits, axis=-1).numpy()
    sentiment = classify_sentiment(probabilities[0])
    
    print(probabilities)
    return sentiment


def translate_text(text, src_lang='auto', dest_lang='en'):
    translator = Translator()
    translated = translator.translate(text, src=src_lang, dest=dest_lang)
    return translated.text


def csv_file(request):
    dataset_df = pd.read_csv("dataset.csv")

    performance_df = pd.read_csv("model_performance.csv")


    data_dict = {}

    for _, dataset_row in dataset_df.iterrows():
        dataset_name = dataset_row["dataset"]
       
        positive_reviews = dataset_row["positive"]
        negative_reviews = dataset_row["negative"]
        neutral_reviews = dataset_row["neutral"]
        total_rows = dataset_row["total"]

        model_accuracies = {}

        for _, performance_row in performance_df.iterrows():
            if performance_row["Dataset"] == dataset_name:
                model = performance_row["Model"]
                accuracy = performance_row["Accuracy"]
                model_accuracies[model] = accuracy

        # Add total rows and sentiment counts to the data dictionary
        data_dict[dataset_name] = {
            "Total Rows": total_rows,
            "Positive Reviews": positive_reviews,
            "Negative Reviews": negative_reviews,
            "Neutral Reviews": neutral_reviews,
            "Model Accuracies": model_accuracies
        }

    # Return JSON response
    return JsonResponse(data_dict, safe=False)


def models_accuracy(request):
    df = pd.read_csv("model_performance.csv")

    data_dict = {}

    for _, row in df.iterrows():
        dataset = row["Dataset"]
        model = row["Model"]
        accuracy = row["Accuracy"]
        
        if dataset not in data_dict:
            data_dict[dataset] = {}  
        
        data_dict[dataset][model] = accuracy

    highest_accuracy_models = {}
    for dataset_data in data_dict.values():
        for model, accuracy in dataset_data.items():
            if model not in highest_accuracy_models or accuracy > highest_accuracy_models[model]:
                highest_accuracy_models[model] = accuracy

    response_data = highest_accuracy_models

    return JsonResponse(response_data)

def predict_csv(request):
    if request.method == 'POST' and request.FILES.get('file'):
        csv_file = request.FILES['file']
        
        try:
            df = pd.read_csv(csv_file)
        except Exception as e:
            return JsonResponse({'error': f'Error reading CSV file: {str(e)}'}, status=400)
        
        async def process_row(row):
            sentence = row['text']
            text = text_translation(sentence)
            sentiment = predict_sentiment(text)
            return sentiment, row['userId']
        
        async def process_rows():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            tasks = [process_row(row) for _, row in df.iterrows()]
            results = await asyncio.gather(*tasks)
            return results
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        results = loop.run_until_complete(process_rows())
        
        positive_users = [userId for sentiment, userId in results if sentiment == 'Positive']
        negative_users = [userId for sentiment, userId in results if sentiment == 'Negative']
        neutral_users = [userId for sentiment, userId in results if sentiment == 'Neutral']
        
        positive_count = len(positive_users)
        negative_count = len(negative_users)
        neutral_count = len(neutral_users)
        
        response_data = {
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count,
            'positive_id': positive_users,
            'negative_id': negative_users,
            'neutral_id': neutral_users
        }
        
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)