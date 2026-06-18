from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django.utils import timezone
import logging
from concurrent.futures import ThreadPoolExecutor
import atexit

from .models import Article, Category

logger = logging.getLogger(__name__)

# Single-worker background executor for pre-warming so it doesn't block the Django save signal
_prewarm_executor = ThreadPoolExecutor(max_workers=1)
atexit.register(_prewarm_executor.shutdown, wait=False)


def pre_warm_cache_task():
    """
    Runs requests internally against Django's views using RequestFactory.
    This generates and populates the Redis cache before any user visits the site,
    preventing cold-start delay (cache stampede) on low-resource free-tier servers.
    """
    from django.test import RequestFactory
    from .views import ArticleListView, BreakingArticlesView, CategoryListView, CategoryArticleListView

    factory = RequestFactory()
    # NOTE: If you increase the frontend homepage page size (e.g. if you add
    # more categories in the future), make sure to update 'page_size' here to match!
    endpoints = [
        ('/api/articles/', ArticleListView, {'page': '1', 'page_size': '30'}, {}),
        ('/api/articles/breaking/', BreakingArticlesView, {}, {}),
        ('/api/categories/', CategoryListView, {}, {}),
        ('/api/categories/day-fact/articles/', CategoryArticleListView, {'page': '1'}, {'slug': 'day-fact'}),
    ]

    logger.info("Starting background cache pre-warming...")
    for path, view_class, query_params, kwargs in endpoints:
        try:
            # Match the headers (Accept: application/json) so the generated cache key
            # matches what frontend fetch() requests generate. We set HTTP_HOST to
            # a valid allowed host to bypass DisallowedHost check when DEBUG=False.
            request = factory.get(
                path,
                query_params,
                HTTP_HOST='sudo-server.alwaysdata.net',
                HTTP_ACCEPT='application/json'
            )
            view = view_class.as_view()
            view(request, **kwargs)
            logger.info(f"Successfully pre-warmed cache for {path}")
        except Exception as e:
            logger.error(f"Failed to pre-warm cache for {path}: {e}")
    logger.info("Background cache pre-warming completed.")


@receiver([post_save, post_delete], sender=Article)
@receiver([post_save, post_delete], sender=Category)
def clear_news_cache(sender, **kwargs):
    """
    Clears the cache when articles or categories are added, updated, or deleted.
    This ensures that when n8n ingests new articles once a day, the frontend
    will instantly show the latest data.

    Also writes a version timestamp AFTER clearing so the lightweight
    /api/news-version/ endpoint can tell browsers that new content exists,
    without them having to poll the full article payload.
    """
    cache.clear()
    # Must be set AFTER clear() so the key is present immediately.
    # 24-hour TTL is a safety net — refreshed on every article save.
    cache.set('news_last_updated', int(timezone.now().timestamp()), timeout=86400)
    
    # Trigger cache pre-warming in the background thread
    _prewarm_executor.submit(pre_warm_cache_task)

