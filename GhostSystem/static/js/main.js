function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
$(window).on("load", function () {
  "use strict";
  /*=========================================================================
          Preloader
  =========================================================================*/
  $("#preloader").delay(500).fadeOut("slow");
});

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Header Clone and Scroll Behavior
  const header = document.querySelector(".header-default");
  if (header) {
    const clone = header.cloneNode(true);
    clone.classList.add("clone");
    header.parentNode.insertBefore(clone, header);

    window.addEventListener("scroll", function () {
      const fromTop = window.scrollY;
      document.body.classList.toggle("down", fromTop > 300);
    });
  }
});

$(function () {
  "use strict";

  $(".sidebar").stickySidebar({
    topSpacing: 60,
    bottomSpacing: 30,
    containerSelector: ".main-content",
  });
  $(".submenu").before('<i class="icon-arrow-down switch"></i>');

  $(".canvas-menu .btn-close, .main-overlay").on("click", function () {
    $(".canvas-menu").removeClass("open");
    $(".main-overlay").removeClass("active");
  });

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

  // share toggle button

  var list = document.getElementsByClassName("spacer");
  for (var i = 0; i < list.length; i++) {
    var size = list[i].getAttribute("data-height");
    list[i].style.height = "" + size + "px";
  }

  var list = document.getElementsByClassName("data-bg-image");

  for (var i = 0; i < list.length; i++) {
    var bgimg = list[i].getAttribute("data-bg-image");
    list[i].style.backgroundImage = "url('" + bgimg + "')";
  }
});
window.addEventListener("load", () => {
  const loader = document.querySelector("#preloader");

  loader.classList.add("#preloader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});
const body = document.querySelector("body"),
  nav = document.querySelector("nav"),
  searchToggle = document.querySelector(".searchToggle"),
  sidebarOpen = document.querySelector(".sidebarOpen"),
  siderbarClose = document.querySelector(".siderbarClose");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark");
}

// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

//   js code to toggle sidebar
sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});

body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("menu")
  ) {
    nav.classList.remove("active");
  }
});

$(document).ready(function () {
  const csrftoken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  $("#load-more-btn").on("click", function () {
    alert("click");
    let query = getQueryParam("query"); // URL에서 'query' 값 읽기

    let _CurrentRes = $(".postbox").length;
    let path = window.location.pathname; // "/Category/3"
    let pathParts = path.split("/"); // ["", "Category", "3"]

    let categoryId = pathParts[pathParts.length - 1]; // 마지막 요소는 "3"
    $.ajax({
      url: "/load-more/", // Django의 URL 경로
      type: "post",
      headers: {
        "X-CSRFToken": csrftoken, // CSRF 토큰 추가
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

        // JSON 데이터를 파싱
        let json_data = res.posts; // 이미 JSON 형식으로 응답이 오므로 JSON.parse를 생략

        // 각 데이터 항목에 대해 HTML 생성
        $.each(json_data, function (index, post) {
          const fields = post; // fields 부분 추출

          const categoryName = fields.category; // 카테고리 이름을 직접 사용

          _html += `
            <div class="col-md-12 col-sm-12 postbox">
                <!-- post -->
                <div class="post post-list clearfix">
                    <div class="thumb">
                        <a href="/post/${post.id}">
                            <div class="inner">
                                <img src="${
                                  fields.feture_image
                                }" alt="Post Image" />
                            </div>
                        </a>
                    </div>
                    <div class="details">
                        <ul class="meta list-inline mb-3">
                            <li class="list-inline-item">
                                <a href="#">${fields.author}</a>
                            </li>
                            <li class="list-inline-item">
                                <a href="/category/${categoryName}">${categoryName}</a>  <!-- 카테고리 값 사용 -->
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
            </div>
            `;
        });

        // 생성된 HTML을 DOM에 추가
        $(".post-post-wrapper").append(_html);

        // 로드 버튼 상태 복원
        $("#load-more-btn").removeClass("disabled").text("Load More");
      },
      error: function (xhr, status, error) {
        console.error(error);

        $("#load-more-btn").removeClass("disabled").text("Load More");
      },
    });
  });
});
/*<![CDATA[*/
/*! Pre code with copy button v2.0 | (c) anutrickz | https://anutrickz.blogspot.com/ */
var codeBlocks = document.querySelectorAll("pre");
codeBlocks.forEach(function (t) {
  var o = document.createElement("button");
  (o.className = "at_copy"),
    (o.type = "button"),
    (o.ariaLabel = "Copy code to clipboard"),
    (o.innerText = "Copy"),
    t.append(o),
    o.addEventListener("click", function () {
      var e = t.querySelector("code").innerText.trim();
      window.navigator.clipboard.writeText(e), (o.innerText = "Copied");
      setTimeout(function () {
        o.innerText = "Copy";
      }, 1e3);
    });
});
/*]]>*/
