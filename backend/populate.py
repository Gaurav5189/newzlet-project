import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.news.models import Category, Article
from django.contrib.auth.models import User

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created: username 'admin', password 'admin123'")
else:
    print("Superuser 'admin' already exists.")

# Create categories
categories = [
    {"name": "International", "slug": "international", "color": "#3B82F6", "emoji": "🌍"},
    {"name": "Politics", "slug": "politics", "color": "#EF4444", "emoji": "🏛️"},
    {"name": "Technology", "slug": "technology", "color": "#8B5CF6", "emoji": "💻"},
    {"name": "Medical", "slug": "medical", "color": "#10B981", "emoji": "🏥"},
    {"name": "Fun Fact Daily", "slug": "fun-fact", "color": "#F59E0B", "emoji": "✨"},
    {"name": "Sports", "slug": "sports", "color": "#F97316", "emoji": "⚽"},
    {"name": "Business", "slug": "business", "color": "#6366F1", "emoji": "📈"},
    {"name": "Entertainment", "slug": "entertainment", "color": "#EC4899", "emoji": "🎬"},
]

for cat_data in categories:
    Category.objects.get_or_create(slug=cat_data["slug"], defaults=cat_data)

print("Categories populated.")

# Create articles
tech = Category.objects.get(slug='technology')
pol = Category.objects.get(slug='politics')
intl = Category.objects.get(slug='international')
fun = Category.objects.get(slug='fun-fact')

articles = [
    {
        "title": "Quantum Computing Breakthrough Could Revolutionize AI",
        "summary": "Researchers have announced a major leap in quantum processing capabilities, reducing error rates by 10x. This could lead to a massive acceleration in AI training models and new discoveries.",
        "image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
        "source_url": "https://example.com/quantum",
        "source_name": "Tech Insider",
        "category": tech,
        "is_breaking": True,
        "published_at": timezone.now() - timedelta(hours=1)
    },
    {
        "title": "Global Summit Addresses Climate Targets for 2030",
        "summary": "World leaders gather in Geneva to discuss more aggressive climate action plans and carbon reduction targets for the end of the decade.",
        "image_url": "https://images.unsplash.com/photo-1611273426858-450d8e81430e?w=800&q=80",
        "source_url": "https://example.com/climate",
        "source_name": "Global News",
        "category": intl,
        "is_breaking": False,
        "published_at": timezone.now() - timedelta(hours=3)
    },
    {
        "title": "New Tech Legislation Debated in Congress",
        "summary": "Lawmakers are pushing forward with a new bill aimed at regulating data privacy across major technology platforms to ensure better safety for end users.",
        "image_url": "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80",
        "source_url": "https://example.com/legislation",
        "source_name": "Capitol Weekly",
        "category": pol,
        "is_breaking": False,
        "published_at": timezone.now() - timedelta(hours=5)
    },
    {
        "title": "Did you know? Honey never spoils!",
        "summary": "Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat. Truly amazing!",
        "image_url": "https://images.unsplash.com/photo-1587049352847-4d4b1f49b18b?w=800&q=80",
        "source_url": "https://example.com/honey",
        "source_name": "History Daily",
        "category": fun,
        "is_breaking": False,
        "published_at": timezone.now() - timedelta(hours=2)
    }
]

for art_data in articles:
    Article.objects.get_or_create(source_url=art_data["source_url"], defaults=art_data)

print("Sample articles populated.")
