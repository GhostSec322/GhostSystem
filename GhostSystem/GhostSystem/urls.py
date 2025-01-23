from django.contrib import admin
from django.urls import path, include
from blog import views as blog
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import handler404
from django.views.static import serve
# handler404 등록
handler404 = "blog.views.custom_404_view"

urlpatterns = [
      path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    path('static/<path:path>', serve, {'document_root': settings.STATIC_ROOT}),
    path("admin/", admin.site.urls),
     path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    path("base/", blog.base, name="base"),
    path("", blog.index, name="home"),
    path("about/", blog.about, name="about"),
    path("post/<int:id>/", blog.post, name="post"),
    path("category/<int:id>", blog.category, name="category"),  # 수정
    path("search/", blog.search, name="search"),
    path("load-more/", blog.load_more, name="load-more"),
]

# 정적 및 미디어 파일 경로 매핑
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
