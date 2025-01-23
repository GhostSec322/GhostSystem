// URL 파라미터 가져오기
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Preloader 기능
window.addEventListener("load", () => {
  const loader = document.querySelector("#preloader");

  if (loader) {
    loader.classList.add("#preloader--hidden");

    loader.addEventListener("transitionend", () => {
      document.body.removeChild(loader);
    });
  }
});

// Header Clone 및 Scroll Behavior
document.addEventListener("DOMContentLoaded", function () {
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




// 검색 토글 버튼
const searchToggle = document.querySelector(".searchToggle");
if (searchToggle) {
  searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("active");
  });
}

// 사이드바 열기/닫기
const sidebarOpen = document.querySelector(".sidebarOpen");
const nav = document.querySelector("nav");
body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("menu")
  ) {
    nav.classList.remove("active");
  }
});

if (sidebarOpen) {
  sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

// 코드 복사 버튼
document.querySelectorAll("pre").forEach(function (block) {
  const button = document.createElement("button");
  button.className = "at_copy";
  button.type = "button";
  button.ariaLabel = "Copy code to clipboard";
  button.innerText = "Copy";

  block.append(button);

  button.addEventListener("click", function () {
    const code = block.querySelector("code").innerText.trim();
    window.navigator.clipboard.writeText(code);
    button.innerText = "Copied";
    setTimeout(() => {
      button.innerText = "Copy";
    }, 1000);
  });
});
