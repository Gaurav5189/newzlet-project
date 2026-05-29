from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Article, Category

@receiver([post_save, post_delete], sender=Article)
@receiver([post_save, post_delete], sender=Category)
def clear_news_cache(sender, **kwargs):
    """
    Clears the cache when articles or categories are added, updated, or deleted.
    This ensures that when n8n ingests new articles once a day, the frontend 
    will instantly show the latest data.
    """
    cache.clear()
