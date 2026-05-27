from django.db import models

class Category(models.Model):
    name  = models.CharField(max_length=100)        # "Technology"
    slug  = models.SlugField(unique=True)            # "technology"
    color = models.CharField(max_length=7)           # "#8B5CF6"
    emoji = models.CharField(max_length=10)          # "💻"

    def __str__(self):
        return self.name


class Article(models.Model):
    title        = models.CharField(max_length=500)
    summary      = models.TextField()
    image_url    = models.URLField(blank=True, null=True)
    source_url   = models.URLField(unique=True)      # deduplication key
    source_name  = models.CharField(max_length=200)  # "BBC News"
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    published_at = models.DateTimeField()
    created_at   = models.DateTimeField(auto_now_add=True)
    read_time    = models.PositiveSmallIntegerField(default=1)  # minutes
    is_breaking  = models.BooleanField(default=False)
    is_visible   = models.BooleanField(default=True)

    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['category', '-published_at']),
            models.Index(fields=['-published_at']),
            models.Index(fields=['is_breaking']),
        ]

    def __str__(self):
        return self.title
