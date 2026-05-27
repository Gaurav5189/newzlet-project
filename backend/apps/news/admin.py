from django.contrib import admin
from .models import Article, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'emoji']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display   = ['title', 'category', 'source_name', 'published_at',
                      'read_time', 'is_breaking', 'is_visible']
    list_filter    = ['category', 'is_breaking', 'is_visible', 'published_at']
    search_fields  = ['title', 'summary', 'source_name']
    list_editable  = ['is_breaking', 'is_visible']
    ordering       = ['-published_at']
    date_hierarchy = 'published_at'
    actions        = ['mark_breaking', 'unmark_breaking', 'hide_selected']

    @admin.action(description="Mark selected articles as breaking")
    def mark_breaking(self, request, queryset):
        queryset.update(is_breaking=True)

    @admin.action(description="Unmark selected articles as breaking")
    def unmark_breaking(self, request, queryset):
        queryset.update(is_breaking=False)

    @admin.action(description="Hide selected articles")
    def hide_selected(self, request, queryset):
        queryset.update(is_visible=False)
