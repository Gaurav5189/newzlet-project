from django.contrib import admin
from .models import Article, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display   = ['title', 'category', 'source_name', 'published_at', 'is_visible']
    list_filter    = ['category', 'is_visible', 'published_at']
    search_fields  = ['title', 'summary', 'source_name']
    list_editable  = ['is_visible']
    ordering       = ['-published_at']
    date_hierarchy = 'published_at'
    actions        = ['hide_selected']

    @admin.action(description="Hide selected articles")
    def hide_selected(self, request, queryset):
        queryset.update(is_visible=False)
