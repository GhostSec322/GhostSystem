from django.contrib import admin
from .models import Post, Category, About


class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "date", "status"]
    list_editable = ["status"]
    search_fields = ["title"]

    # author 필드를 읽기 전용으로 설정
    readonly_fields = ["author", "slug"]

    def save_model(self, request, obj, form, change):
        # author 필드를 현재 로그인한 사용자로 설정
        if not obj.pk:  # 새로 생성하는 경우에만 설정
            obj.author = request.user
        super().save_model(request, obj, form, change)

        class Media:
            css = {"all": ("css/admin.css",)}  # 커스텀 CSS 경로


admin.site.register(Category)
admin.site.register(Post, PostAdmin)

admin.site.register(About)
