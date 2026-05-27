from django.urls import path
from .views import IngestArticleView

urlpatterns = [
    path('articles/', IngestArticleView.as_view(), name='ingest-article'),
]
