from rest_framework import generics
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from .filters import ArticleFilter

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True)
    serializer_class = ArticleSerializer

class BreakingArticlesView(generics.ListAPIView):
    queryset = Article.objects.filter(is_breaking=True, is_visible=True)
    serializer_class = ArticleSerializer
    pagination_class = None

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

class CategoryArticleListView(generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Article.objects.filter(category__slug=slug, is_visible=True)

class SearchArticlesView(generics.ListAPIView):
    queryset = Article.objects.filter(is_visible=True)
    serializer_class = ArticleSerializer
    filterset_class = ArticleFilter
