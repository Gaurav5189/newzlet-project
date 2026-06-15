from rest_framework import generics
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers  # for redis cache 

from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer, ContactMessageSerializer
from .filters import ArticleFilter
from config.middleware.throttling import CloudflareContactThrottle

# Cache the standard article timeline feed for 6 hours (21600 seconds)
@method_decorator(cache_page(60 * 60 * 6), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True).exclude(category__slug='day-fact')
    serializer_class = ArticleSerializer

# Cache the breaking news ticker for 5 minutes (300 seconds) since it changes quickly
@method_decorator(cache_page(60 * 5), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class BreakingArticlesView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = None

    def get_queryset(self):
        return Article.objects.filter(is_visible=True).exclude(category__slug='day-fact')[:5]

# Cache categories list for 12 hour (categories change rarely but not daily)
@method_decorator(cache_page(60 * 60 * 12), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

# Cache specific category lists for 1 hour
@method_decorator(cache_page(60 * 60), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class CategoryArticleListView(generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Article.objects.filter(category__slug=slug, is_visible=True)

class SearchArticlesView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True).exclude(category__slug='day-fact')
    serializer_class = ArticleSerializer
    filterset_class = ArticleFilter

class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    throttle_classes = [CloudflareContactThrottle]

