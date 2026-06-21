from rest_framework import serializers
from .models import Article, Category, ContactMessage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']

class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'summary', 'ai_summary', 'image_url', 'source_url', 
            'source_name', 'category', 'published_at', 
            'created_at'
        ]

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        from django.utils.html import strip_tags
        sanitized = strip_tags(value).strip()
        if not sanitized:
            raise serializers.ValidationError("Name cannot be empty or only HTML tags.")
        return sanitized

    def validate_message(self, value):
        from django.utils.html import strip_tags
        sanitized = strip_tags(value).strip()
        if not sanitized:
            raise serializers.ValidationError("Message cannot be empty or only HTML tags.")
        return sanitized

    def validate_email(self, value):
        return value.strip().lower()
