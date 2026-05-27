import django_filters
from .models import Article

class ArticleFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    date_from = django_filters.DateTimeFilter(field_name='published_at', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='published_at', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')

    class Meta:
        model = Article
        fields = ['q', 'date_from', 'date_to', 'category']
