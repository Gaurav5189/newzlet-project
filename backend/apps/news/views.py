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

from django.middleware.cache import CacheMiddleware

# Bounded pool for async webhook dispatch — max_workers=2 keeps memory
# predictable on the free-tier host (0.25 CPU / 256 MB RAM). The
# CloudflareContactThrottle already limits burst, so 2 workers is plenty.
_webhook_executor = ThreadPoolExecutor(max_workers=2)
atexit.register(_webhook_executor.shutdown, wait=False)


def cache_api_page(timeout, cache_alias='default', key_prefix=None):
    """
    Custom decorator for caching Django REST Framework (DRF) views on the server
    (e.g., in Upstash Redis) while ensuring browsers always request fresh content
    (`Cache-Control: no-store`).

    This solves a known Django/DRF gotcha: DRF views return unrendered Response
    objects, which raise ContentNotRenderedError when Django tries to pickle them
    for the cache backend. By forcing response.render() inside this decorator
    before passing it to the CacheMiddleware, we ensure responses are safely cached
    while returning correct headers to the browser.
    """
    def decorator(view_func):
        middleware = CacheMiddleware(get_response=view_func, page_timeout=timeout, cache_alias=cache_alias, key_prefix=key_prefix)
        
        def _wrapped(request, *args, **kwargs):
            # 1. Try to fetch from Redis
            cached_response = middleware.process_request(request)
            if cached_response is not None:
                cached_response['Cache-Control'] = 'no-store'
                return cached_response
                
            # 2. Cache miss. Run dispatch to get a finalized response
            response = view_func(request, *args, **kwargs)
            
            # 3. Render the DRF template/JSON response so Django can pickle it
            if hasattr(response, 'render') and callable(response.render):
                response.render()
                
            # 4. Cache the rendered response (without 'no-store' header)
            response = middleware.process_response(request, response)
            
            # 5. Add 'no-store' for the client browser
            response['Cache-Control'] = 'no-store'
            return response
            
        return _wrapped
    return decorator


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
@method_decorator(cache_api_page(60 * 60 * 6), name='dispatch')
class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True).exclude(category__slug='day-fact').select_related('category')
    serializer_class = ArticleSerializer

# Cache the breaking news ticker for 5 minutes (300 seconds) since it changes quickly
@method_decorator(cache_api_page(60 * 5), name='dispatch')
class BreakingArticlesView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = None

    def get_queryset(self):
        return Article.objects.filter(is_visible=True).exclude(category__slug='day-fact').select_related('category')[:5]

# Cache categories list for 12 hour (categories change rarely but not daily)
@method_decorator(cache_api_page(60 * 60 * 12), name='dispatch')
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

# Cache specific category lists for 6 hours
@method_decorator(cache_api_page(60 * 60 * 6), name='dispatch')
class CategoryArticleListView(generics.ListAPIView):
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
        response = Response({'version': version})
        response['Cache-Control'] = 'no-store'
        return response
