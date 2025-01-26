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
