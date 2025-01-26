$(window).on("load", function () {
  "use strict";

  // Preloader 제거
  $("#preloader").delay(500).fadeOut("slow");
});

$(function () {
  "use strict";

  // Sticky Sidebar 설정
  $(".sidebar").stickySidebar({
    topSpacing: 60,
    bottomSpacing: 30,
    containerSelector: ".main-content",
  });

  // 서브메뉴 화살표 추가
  $(".submenu").before('<i class="icon-arrow-down switch"></i>');

  // Canvas 메뉴 닫기
  $(".canvas-menu .btn-close, .main-overlay").on("click", function () {
    $(".canvas-menu").removeClass("open");
    $(".main-overlay").removeClass("active");
  });

  // 검색 팝업 열기/닫기
  $("button.search").on("click", function () {
    $(".search-popup").addClass("visible");
  });
  $(".search-popup .btn-close").on("click", function () {
    $(".search-popup").removeClass("visible");
  });
  $(document).keyup(function (e) {
    if (e.key === "Escape") {
      $(".search-popup").removeClass("visible");
    }
  });

  // Spacer 높이 설정
  $(".spacer").each(function () {
    var size = $(this).data("height");
    $(this).css("height", size + "px");
  });

  // 배경 이미지 설정
  $(".data-bg-image").each(function () {
    var bgimg = $(this).data("bg-image");
    $(this).css("background-image", "url('" + bgimg + "')");
  });

  $(document).on("click", "#load-more-btn", function () {
    const csrftoken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
  
    let query = getQueryParam("query"); // URL에서 'query' 값 읽기
    let _CurrentRes = $(".postbox").length;
    let pathParts = window.location.pathname.split("/"); // URL Path 분석
    let categoryId = pathParts[pathParts.length - 1];
  
    $.ajax({
      url: "/load-more/",
      type: "post",
      headers: {
        "X-CSRFToken": csrftoken,
        "Cache-Control": "no-cache",
      },
      data: {
        offset: _CurrentRes,
        category: categoryId,
        search: query,
      },
      beforeSend: function () {
        $("#load-more-btn").addClass("disabled").text("Loading....");
        console.log("AJAX 요청 전송");
      },
      success: function (res) {
        console.log(res);
        let _html = "";
  
        $.each(res.posts, function (index, post) {
          const fields = post;
          const categoryName = fields.category;
  
          _html += `
            <div class="col-md-12 col-sm-12 postbox">
                <div class="post post-list clearfix">
                    <div class="thumb">
                        <a href="/post/${post.id}">
                            <div class="inner">
                                <img src="${fields.feture_image}" alt="Post Image" />
                            </div>
                        </a>
                    </div>
                    <div class="details">
                        <ul class="meta list-inline mb-3">
                            <li class="list-inline-item"><a href="#">${fields.author}</a></li>
                            <li class="list-inline-item">
                                <a href="/category/${categoryName}">${categoryName}</a>
                            </li>
                            <li class="list-inline-item">${fields.date}</li>
                        </ul>
                        <h5 class="post-title">
                            <a href="/post/${post.id}">${fields.title}</a>
                        </h5>
                        <p class="excerpt mb-0">${fields.content
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .substring(0, 100)}</p>
                    </div>
                </div>
            </div>`;
        });
  
        $(".post-post-wrapper").append(_html);
        $("#load-more-btn").removeClass("disabled").text("Load More");
      },
      error: function (xhr, status, error) {
        console.error(error);
        $("#load-more-btn").removeClass("disabled").text("Load More");
      },
    });
  });
  
});
