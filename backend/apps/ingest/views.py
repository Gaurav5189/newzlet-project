from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_datetime
from django.db import transaction
from django.core.cache import cache
from .auth import ApiKeyAuthentication
from apps.news.models import Article, Category

class IngestArticleView(APIView):
    authentication_classes = [ApiKeyAuthentication]

    def post(self, request):
        data = request.data

        # Support both single object (dict) and multiple objects (list)
        # Also handles nested 'articles_array' format from n8n
        items = []
        if isinstance(data, list):
            for entry in data:
                if isinstance(entry, dict) and 'articles_array' in entry:
                    items.extend(entry['articles_array'])
                else:
                    items.append(entry)
        elif isinstance(data, dict):
            if 'articles_array' in data:
                items.extend(data['articles_array'])
            else:
                items.append(data)
        else:
            return Response(
                {"error": "Invalid request body format. Expected JSON object or JSON array."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response({"message": "No articles to ingest"}, status=status.HTTP_200_OK)

        # Basic validation: source_url and published_at are required for all articles
        for idx, item in enumerate(items):
            if not item.get('source_url'):
                return Response(
                    {"error": f"source_url is required for all articles (missing at index {idx})"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not item.get('published_at'):
                return Response(
                    {"error": f"published_at is required for all articles (missing at index {idx})"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        incoming_urls = [item.get('source_url') for item in items]

        # Deduplicate incoming items against database in a single query
        existing_urls = set(
            Article.objects.filter(source_url__in=incoming_urls).values_list('source_url', flat=True)
        )

        # Deduplicate incoming items against themselves (if there are identical URLs in the same batch)
        seen_urls = set()
        unique_incoming_items = []
        for item in items:
            url = item.get('source_url')
            if url not in existing_urls and url not in seen_urls:
                seen_urls.add(url)
                unique_incoming_items.append(item)

        if not unique_incoming_items:
            return Response({
                "message": "All articles were duplicates, skipping",
                "skipped_duplicates": len(items)
            }, status=status.HTTP_200_OK)

        # Pre-fetch referenced categories in a single query
        category_slugs = {item.get('category_slug') for item in unique_incoming_items if item.get('category_slug')}
        categories = {c.slug: c for c in Category.objects.filter(slug__in=category_slugs)}

        articles_to_create = []
        skipped_invalid = 0

        for item in unique_incoming_items:
            title = item.get('title')
            if not title:
                # title is NOT NULL in the DB; skip rather than crash on bulk_create
                skipped_invalid += 1
                continue
            summary = item.get('summary', '')
            ai_summary = item.get('ai_summary')
            image_url = item.get('image_url')
            source_url = item.get('source_url')
            source_name = item.get('source_name')
            category_slug = item.get('category_slug')
            published_at_str = item.get('published_at')

            published_at = parse_datetime(published_at_str)
            if not published_at:
                skipped_invalid += 1
                continue

            category = categories.get(category_slug) if category_slug else None

            articles_to_create.append(Article(
                title=title,
                summary=summary,
                ai_summary=ai_summary,
                image_url=image_url,
                source_url=source_url,
                source_name=source_name,
                category=category,
                published_at=published_at,
                is_visible=item.get('is_visible', True)
            ))

        if not articles_to_create:
            return Response(
                {"error": "No valid articles to ingest after parsing date formats."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Bulk insert in a transaction
        with transaction.atomic():
            created_articles = Article.objects.bulk_create(articles_to_create)

        # Explicitly clear the cache exactly once at the end of the batch
        cache.clear()

        return Response({
            "message": f"Successfully ingested {len(created_articles)} articles",
            "skipped_duplicates": len(items) - len(unique_incoming_items),
            "skipped_invalid": skipped_invalid
        }, status=status.HTTP_201_CREATED)
