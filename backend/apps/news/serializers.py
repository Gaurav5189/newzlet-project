from rest_framework import serializers
from .models import Article, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug', 'color', 'emoji']

class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'summary', 'image_url', 'source_url', 
            'source_name', 'category', 'published_at', 
            'created_at', 'read_time', 'is_breaking'
        ]
