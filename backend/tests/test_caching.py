import os
import sys
from pathlib import Path

# Add the backend root directory to sys.path to allow absolute imports of 'apps'
sys.path.append(str(Path(__file__).resolve().parent.parent))

import django
try:
    import pytest
except ImportError:
    # Fallback mock decorators when running as a standalone script without pytest installed
    class pytest:
        class mark:
            @staticmethod
            def django_db(func):
                return func
from django.test import RequestFactory
from django.core.cache import cache
import redis

# Setup Django configuration for standalone execution
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

@pytest.mark.django_db
def test_caching_ttl():
    """
    Validates that ArticleListView and CategoryArticleListView are cached
    in Upstash Redis with a 6-hour (21600 seconds) timeout.
    """
    try:
        django.setup()
    except Exception:
        # Django setup might already be handled by pytest-django
        pass
        
    from django.conf import settings
    from apps.news.views import ArticleListView, CategoryArticleListView
        
    # Allow RequestFactory HTTP_HOST header to pass Django host validation
    settings.ALLOWED_HOSTS = ['*']
    
    print("Clearing cache...")
    cache.clear()
    
    factory = RequestFactory()
    r = redis.Redis.from_url(settings.REDIS_URL)
    
    # 1. Test ArticleListView (6 Hours)
    print("\n--- Testing ArticleListView ---")
    request1 = factory.get('/api/articles/', {'page': '1'}, HTTP_HOST='sudo-server.alwaysdata.net', HTTP_ACCEPT='application/json')
    view1 = ArticleListView.as_view()
    response1 = view1(request1)
    
    assert response1.status_code == 200, f"Expected 200, got {response1.status_code}"
    
    keys1 = r.keys(':1:views.decorators.cache.cache_page..*')
    assert len(keys1) > 0, "No cache keys were written to Redis for ArticleListView!"
    for k in keys1:
        ttl = r.ttl(k)
        print(f"Key: {k.decode()} | TTL: {ttl} seconds ({ttl / 3600:.2f} hours)")
        # Allow a small buffer of 30 seconds for network latency
        assert 21570 <= ttl <= 21600, f"Expected TTL to be ~21600 (6 hours), got {ttl}"

    # 2. Test CategoryArticleListView (6 Hours)
    print("\n--- Testing CategoryArticleListView ---")
    # Ensure a Category object exists in the database for the view to list
    from apps.news.models import Category
    category, _ = Category.objects.get_or_create(name='Sports', slug='sports')
    
    request2 = factory.get('/api/categories/sports/articles/', {'page': '1'}, HTTP_HOST='sudo-server.alwaysdata.net', HTTP_ACCEPT='application/json')
    view2 = CategoryArticleListView.as_view()
    response2 = view2(request2, slug='sports')
    
    assert response2.status_code == 200, f"Expected 200, got {response2.status_code}"
    
    keys2 = r.keys(':1:views.decorators.cache.cache_page..*')
    # Since we didn't clear cache after step 1, we expect both keys to exist
    assert len(keys2) >= 2, "No cache keys were written to Redis for CategoryArticleListView!"
    for k in keys2:
        ttl = r.ttl(k)
        print(f"Key: {k.decode()} | TTL: {ttl} seconds ({ttl / 3600:.2f} hours)")
        assert 21570 <= ttl <= 21600, f"Expected TTL to be ~21600 (6 hours), got {ttl}"

if __name__ == "__main__":
    test_caching_ttl()
