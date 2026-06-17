from django.urls import path
from .views import (
    ArticleListView,
    BreakingArticlesView,
    CategoryListView,
    CategoryArticleListView,
    SearchArticlesView,
    ContactMessageCreateView,
    NewsVersionView
)

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list'),
    path('articles/breaking/', BreakingArticlesView.as_view(), name='article-breaking'),
    path('news-version/', NewsVersionView.as_view(), name='news-version'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/articles/', CategoryArticleListView.as_view(), name='category-articles'),
    path('search/', SearchArticlesView.as_view(), name='article-search'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-submit'),
]
