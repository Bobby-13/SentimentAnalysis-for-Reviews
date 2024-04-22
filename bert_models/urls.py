from django.urls import path # type: ignore
from . import views
urlpatterns = [
    path('hey',views.hello,name='hey'),
    path('predict', views.distil_bert_model, name='predict'),
    path('csv_file', views.csv_file, name='csv_file'),
    path('model_accuracy',views.models_accuracy, name='model_accuracy'),
    path('predict_csv', views.predict_csv, name='predict_csv')
]