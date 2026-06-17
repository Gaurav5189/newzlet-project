from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django.utils import timezone
from .models import Article, Category

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
