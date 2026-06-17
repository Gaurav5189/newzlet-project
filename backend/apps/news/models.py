from django.db import models
from django.utils.html import strip_tags

class Category(models.Model):
    name  = models.CharField(max_length=100)        # "Technology"
    slug  = models.SlugField(unique=True)            # "technology"
    color = models.CharField(max_length=7)           # "#8B5CF6"

    def __str__(self):
        return self.name


class Article(models.Model):
    title        = models.CharField(max_length=500)
    summary      = models.TextField()
    ai_summary   = models.TextField(blank=True, null=True)
    image_url    = models.URLField(blank=True, null=True)
    source_url   = models.URLField(unique=True)      # deduplication key
    source_name  = models.CharField(max_length=200)  # "BBC News"
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    published_at = models.DateTimeField()
    created_at   = models.DateTimeField(auto_now_add=True)
    is_visible   = models.BooleanField(default=True)

    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['category', '-published_at']),
            models.Index(fields=['-published_at']),
        ]

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.name = strip_tags(self.name).strip()
        self.email = self.email.strip().lower()
        self.message = strip_tags(self.message).strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
