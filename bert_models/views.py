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

def hello(request):
    return HttpResponse("Hello world !!. .")

# distil_berd_imdb = 'bert_models/Trained_DISTILBERT_Model_imdb' 
# loaded_model = TFAutoModelForSequenceClassification.from_pretrained(distil_berd_imdb)
# tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')

max_length = 200
labels = ["Negative", "Neutral", "Positive"]



def convert_probabilities(probabilities):
    positive_percentage = probabilities[1] * 100
    negative_percentage = probabilities[0] * 100
    return positive_percentage, negative_percentage

# def distil_bert_model(request):
    
#     data = json.loads(request.body)
    
#     sentence = data['sentence']
#     modelname = data['model']
        
#     text = text_translation(sentence)
    
#     model_name, probabilities, predicted_sentiment1 = predict_sentiment(text,modelname)
    
#     for model_name in ["BERT", "BERT-LARGE", "DISTIL-BERT", "ROBERT", "ALBERT"]:
#         model_name, probabilities, sentiment = predict_sentiment(text, model_name)
#         positive_percentage, negative_percentage = convert_probabilities(probabilities[0])
#         print(f"Model: {model_name}, Sentiment: {sentiment}, Positive Percentage: {positive_percentage:.2f}%, Negative Percentage: {negative_percentage:.2f}%")
      
         
#     response_data = {
#         "Sentence": text,
#         "Predicted_Sentiment": predicted_sentiment1,
#     }
    
#     return JsonResponse(response_data)

def distil_bert_model(request):
    data = json.loads(request.body)
    sentence = data['sentence']
    # modelname = data['model']
        
    text = text_translation(sentence)
    
    model_results = {}
    
    for model_name in ["BERT", "BERT-LARGE", "DISTIL-BERT", "ROBERT", "ALBERT"]:
        model_name, probabilities, sentiment = predict_sentiment(text, model_name)
        positive_percentage, negative_percentage = convert_probabilities(probabilities[0])
        model_results[model_name] = {
            "positive": f"{positive_percentage:.2f}%",
            "negative": f"{negative_percentage:.2f}%"
        }
      
    response_data = {
        "Sentence": text,
        "Model_Sentiment": model_results
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
    print("***",probabilities)
    positive_threshold = 0.7
    negative_threshold = 0.4
    positive_prob = probabilities[1]
    negative_prob = probabilities[0]
    
    if positive_prob >= positive_threshold:
        return "Positive"
    elif negative_prob >= negative_threshold:
        return "Negative"
    else:
        return "Neutral"

def predict_sentiment(sentence, model_name):
    
    model_paths = {
        "BERT": 'bert_models/Trained_distilbert-base-uncased_yelp',
        "BERT-LARGE": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "DISTIL-BERT": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "ROBERT": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "ALBERT": 'bert_models/Trained_DISTILBERT_Model_imdb'
    }
    
    # model_tokenizer = {
    #     "BERT": 'bert-base-uncased',
    #     "BERT-LARGE": 'bert-large-uncased',
    #     "DISTIL-BERT": 'distilbert-base-uncased',
    #     "ROBERT": 'roberta-base',
    #     "ALBERT": 'albert-base-v2'
    # }
    
    model_tokenizer = {
        "BERT": 'distilbert-base-uncased',
        "BERT-LARGE": 'distilbert-base-uncased',
        "DISTIL-BERT": 'distilbert-base-uncased',
        "ROBERT": 'distilbert-base-uncased',
        "ALBERT": 'distilbert-base-uncased'
    }
    
    loaded_model = TFAutoModelForSequenceClassification.from_pretrained(model_paths[model_name])
    tokenizer = AutoTokenizer.from_pretrained(model_tokenizer[model_name])
           

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
    
    
    print("Probabilities :",probabilities,"====> ",sentiment)
    return model_name, probabilities, sentiment

def predict_sentiment1(sentence):
    
    model_paths = {
        "BERT": 'bert_models/Trained_distilbert-base-uncased_yelp',
        "BERT-LARGE": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "DISTIL-BERT": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "ROBERT": 'bert_models/Trained_DISTILBERT_Model_imdb',
        "ALBERT": 'bert_models/Trained_DISTILBERT_Model_imdb'
    }
    
    # model_tokenizer = {
    #     "BERT": 'bert-base-uncased',
    #     "BERT-LARGE": 'bert-large-uncased',
    #     "DISTIL-BERT": 'distilbert-base-uncased',
    #     "ROBERT": 'roberta-base',
    #     "ALBERT": 'albert-base-v2'
    # }
    
    model_tokenizer = {
        "BERT": 'distilbert-base-uncased',
        "BERT-LARGE": 'distilbert-base-uncased',
        "DISTIL-BERT": 'distilbert-base-uncased',
        "ROBERT": 'distilbert-base-uncased',
        "ALBERT": 'distilbert-base-uncased'
    }
    
    loaded_model = TFAutoModelForSequenceClassification.from_pretrained(model_paths['BERT'])
    tokenizer = AutoTokenizer.from_pretrained(model_tokenizer['BERT'])
           

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
    
    
    print("Probabilities :",probabilities,"====> ",sentiment)
    return sentiment

# def translate_text(text, src_lang='auto', dest_lang='en'):
#     translator = Translator()
#     translated = translator.translate(text, src=src_lang, dest=dest_lang)
#     return translated.text

def translate_text(text, src_lang='auto', dest_lang='en'):
    if text is None:
        return ""

    try:
        translator = Translator()
        translated = translator.translate(text, src=src_lang, dest=dest_lang)
        return translated.text
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return ""


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
        
        print(dataset_name)
        
        for _, performance_row in performance_df.iterrows():
            
            if performance_row["Dataset"] == dataset_name:
                model = performance_row["Model"]
                accuracy = performance_row["Accuracy"]
                model_accuracies[model] = accuracy
        
        data_dict[dataset_name] = {
            "Total Rows": total_rows,
            "Positive Reviews": positive_reviews,
            "Negative Reviews": negative_reviews,
            "Neutral Reviews": neutral_reviews,
            "Model Accuracies": model_accuracies
        }
        
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
            sentiment = predict_sentiment1(text)
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
            # 'positive_id': positive_users,
            # 'negative_id': negative_users,
            # 'neutral_id': neutral_users
        }
        
        print(  response_data)
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)