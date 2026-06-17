from decouple import config
import atexit
from concurrent.futures import ThreadPoolExecutor
import requests
import logging
from django.core.cache import cache
from django.utils import timezone
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers  # for redis cache 

from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer, ContactMessageSerializer
from .filters import ArticleFilter
from config.middleware.throttling import CloudflareContactThrottle

logger = logging.getLogger(__name__)

# Bounded pool for async webhook dispatch — max_workers=2 keeps memory
# predictable on the free-tier host (0.25 CPU / 256 MB RAM). The
# CloudflareContactThrottle already limits burst, so 2 workers is plenty.
_webhook_executor = ThreadPoolExecutor(max_workers=2)
atexit.register(_webhook_executor.shutdown, wait=False)

class NoBrowserCacheMixin:
    """
    Overrides the Cache-Control header on API responses to 'no-store'.

    Django's cache_page decorator does two things at once:
      1. Caches the response server-side in Redis (we want this).
      2. Sets Cache-Control: max-age=N on the HTTP response (we don't want
         this — it causes browsers to serve stale API JSON for hours).

    This mixin runs after cache_page has already stored the response in
    Redis, then replaces the header so browsers always make a fresh
    network request. Redis still serves those requests instantly.
    """
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        response['Cache-Control'] = 'no-store'
        return response


def send_n8n_webhook(data):
    # Using the webhook URL from environment variables loaded via python-decouple
    webhook_url = config("N8N_WEBHOOK_URL", default="")
    if not webhook_url:
        logger.error("N8N_WEBHOOK_URL not configured in environment.")
        return
        
    try:
        requests.post(webhook_url, json=data, timeout=5)
    except Exception as e:
        logger.error(f"Failed to send webhook to n8n: {e}")

# Cache the standard article timeline feed for 6 hours (21600 seconds)
@method_decorator(cache_page(60 * 6 * 6), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class ArticleListView(NoBrowserCacheMixin, generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True).exclude(category__slug='day-fact').select_related('category')
    serializer_class = ArticleSerializer

# Cache the breaking news ticker for 5 minutes (300 seconds) since it changes quickly
@method_decorator(cache_page(60 * 5), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class BreakingArticlesView(NoBrowserCacheMixin, generics.ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = None

    def get_queryset(self):
        return Article.objects.filter(is_visible=True).exclude(category__slug='day-fact').select_related('category')[:5]

# Cache categories list for 12 hour (categories change rarely but not daily)
@method_decorator(cache_page(60 * 60 * 12), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class CategoryListView(NoBrowserCacheMixin, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

# Cache specific category lists for 1 hour
@method_decorator(cache_page(60 * 60), name='get')
@method_decorator(vary_on_headers('Accept'), name='get')
class CategoryArticleListView(NoBrowserCacheMixin, generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Article.objects.filter(category__slug=slug, is_visible=True).select_related('category')

class SearchArticlesView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True).exclude(category__slug='day-fact').select_related('category')
    serializer_class = ArticleSerializer
    filterset_class = ArticleFilter

class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    throttle_classes = [CloudflareContactThrottle]

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Fire off webhook to n8n asynchronously so we don't block the API response
        data = {
            "name": instance.name,
            "email": instance.email,
            "message": instance.message,
            "created_at": instance.created_at.isoformat() if instance.created_at else None
        }
        _webhook_executor.submit(send_n8n_webhook, data)


class NewsVersionView(APIView):
    """
    Returns the Unix timestamp of the last article/category update.

    The frontend polls this lightweight endpoint every 3 minutes instead
    of polling the full article payload. The response is ~30 bytes and is
    served from a single Redis key — no database queries involved.

    When the timestamp changes, the frontend shows a 'Refresh' banner so
    the user can pull fresh articles into view without a disruptive reload.
    """
    def get(self, request):
        version = cache.get('news_last_updated')
        if version is None:
            # Cold start (first request after deploy or Redis flush).
            # Establish a baseline so the next real update is detectable.
            version = int(timezone.now().timestamp())
            cache.set('news_last_updated', version, timeout=86400)
        return Response({'version': version})
