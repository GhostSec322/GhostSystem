from django.shortcuts import render, redirect, get_object_or_404
from blog.models import *
from django.db.models import Count
from django.utils.html import strip_tags
from django.conf.urls import handler404
from django.core import serializers
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime


def base(request):
    return render(request, "Main/base.html")


def index(request):
    # HTML 태그 제거 및 텍스트로 변환
    posts = Post.objects.all()[:4]
    for post in posts:
        post.content = strip_tags(post.content)

    # 카테고리별 게시물 수 계산
    categories_with_post_counts = Category.objects.annotate(post_count=Count("post"))

    return render(
        request,
        "Main/index.html",
        {"posts": posts, "Category": categories_with_post_counts},
    )


def about(request):
    # 카테고리별 게시물 수 계산
    about = About.objects.all()
    categories_with_post_counts = Category.objects.annotate(post_count=Count("post"))

    return render(
        request,
        "Main/about.html",
        {"about": about, "Category": categories_with_post_counts},
    )


def post(request, id):
    print(id)
    post = get_object_or_404(Post, id=id)
    categories_with_post_counts = Category.objects.annotate(post_count=Count("post"))

    print(post)

    return render(
        request,
        "Main/post.html",
        {
            "post": post,
            "Category": categories_with_post_counts,
        },
    )


def category(request, id):
    print(id)
    posts = Post.objects.filter(category=id)[:4]
    for post in posts:
        post.content = strip_tags(post.content)
    categories_with_post_counts = Category.objects.annotate(post_count=Count("post"))

    return render(
        request,
        "Main/index.html",
        {
            "posts": posts,
            "Category": categories_with_post_counts,
        },
    )


def search(request):
    query = request.GET.get("query", "")  # 'q'라는 파라미터를 받아옵니다.

    # 카테고리별 게시물 수 계산
    categories_with_post_counts = Category.objects.annotate(post_count=Count("post"))

    # 기본적으로 posts는 빈 리스트로 초기화
    posts = []

    # 검색어가 있을 경우에만 필터링
    if query:
        # 제목에 검색어가 포함된 포스트들 찾기
        posts = Post.objects.filter(title__icontains=query)[
            :4
        ]  # 제목에 검색어가 포함된 포스트들 찾기
        print(posts)

        # 각 포스트의 내용을 HTML 태그를 제거해서 저장
        for post in posts:
            post.content = strip_tags(post.content)

    return render(
        request,
        "Main/index.html",
        {
            "posts": posts,
            "query": query,
            "Category": categories_with_post_counts,
        },
    )


def load_more(request):
    if request.method == "POST":
        try:
            offset = int(request.POST.get("offset", 0))
            limit = 4  # 한 번에 로드할 게시물 수
            search_query = request.POST.get("search", None)
            category_par = request.POST.get("category", None)

            query_conditions = Q()
            if search_query:
                query_conditions &= Q(title__icontains=search_query)
            if category_par:
                query_conditions &= Q(category__id=category_par)

            # 조건에 맞는 게시물 필터링
            posts = Post.objects.filter(query_conditions)[offset : offset + limit]

            # 총 게시물 수 계산
            totalData = Post.objects.filter(query_conditions).count()

            # 게시물 데이터를 JSON 형식으로 직렬화
            posts_json = []
            for post in posts:
                # `Category` 모델에서 이름 가져오기
                category_name = (
                    Category.objects.get(id=post.category.id).name
                    if post.category
                    else "카테고리 없음"
                )

                # 데이터 직렬화
                posts_json.append(
                    {
                        "id": post.id,
                        "feture_image": (
                            post.feture_image.url if post.feture_image else ""
                        ),
                        "title": post.title,
                        "author": post.author if post.author else "알 수 없음",
                        "category": category_name,
                        "date": post.date.strftime("%b %d, %Y") if post.date else "",
                        "content": post.content,
                        "slug": post.slug,
                        "status": post.status,
                    }
                )

            return JsonResponse(
                {"posts": posts_json, "totalResult": totalData}, safe=False
            )

        except Exception as e:
            print("Error:", str(e))  # 에러 메시지 출력
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# 404 커스텀 뷰 함수
def custom_404_view(request, exception):
    return render(request, "Main/404.html", status=404)
