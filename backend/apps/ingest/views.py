from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_datetime
from .auth import ApiKeyAuthentication
from .utils import calc_read_time, is_duplicate
from apps.news.models import Article, Category

class IngestArticleView(APIView):
    authentication_classes = [ApiKeyAuthentication]

    def post(self, request):
        data = request.data
        source_url = data.get('source_url')

        if not source_url:
            return Response({"error": "source_url is required"}, status=status.HTTP_400_BAD_REQUEST)

        if is_duplicate(source_url):
            return Response({"message": "Duplicate article, skipping"}, status=status.HTTP_200_OK)

        category_slug = data.get('category_slug')
        category = None
        if category_slug:
            category = Category.objects.filter(slug=category_slug).first()

        summary = data.get('summary', '')
        read_time = calc_read_time(summary)

        published_at_str = data.get('published_at')
        if not published_at_str:
            return Response({"error": "published_at is required"}, status=status.HTTP_400_BAD_REQUEST)

        published_at = parse_datetime(published_at_str)
        if not published_at:
            return Response({"error": "Invalid published_at date"}, status=status.HTTP_400_BAD_REQUEST)

        article = Article.objects.create(
            title=data.get('title'),
            summary=summary,
            image_url=data.get('image_url'),
            source_url=source_url,
            source_name=data.get('source_name'),
            category=category,
            published_at=published_at,
            read_time=read_time,
        )

        return Response({"message": "Article ingested successfully"}, status=status.HTTP_201_CREATED)
