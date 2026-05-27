from apps.news.models import Article

def calc_read_time(summary: str) -> int:
    """Average reading speed 200 wpm. Minimum 1 min."""
    if not summary:
        return 1
    return max(1, round(len(summary.split()) / 200))

def is_duplicate(source_url: str) -> bool:
    return Article.objects.filter(source_url=source_url).exists()
