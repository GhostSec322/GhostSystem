import os
import re
from bs4 import BeautifulSoup


# HTML 파일에서 사용된 선택자 추출
def extract_used_selectors(html_files):
    used_classes, used_ids = set(), set()
    for html_file in html_files:
        with open(html_file, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "html.parser")
            # 클래스와 아이디 추출
            used_classes.update(
                cls for tag in soup.find_all(True) for cls in tag.get("class", [])
            )
            used_ids.update(
                tag.get("id") for tag in soup.find_all(True) if tag.get("id")
            )
    return used_classes, used_ids


# CSS 파일에서 선택자 추출
def extract_css_selectors(css_file_path):
    with open(css_file_path, "r", encoding="utf-8") as file:
        css_content = file.read()
    selector_pattern = re.compile(r"([.#][a-zA-Z0-9_-]+)")
    matches = selector_pattern.findall(css_content)
    all_classes = {sel[1:] for sel in matches if sel.startswith(".")}
    all_ids = {sel[1:] for sel in matches if sel.startswith("#")}
    return all_classes, all_ids


# JS 파일에서 선택자 추출
def extract_js_selectors(js_file_path):
    with open(js_file_path, "r", encoding="utf-8") as file:
        js_content = file.read()
    # 클래스와 아이디 선택자 패턴
    class_pattern = re.compile(r"\.\b([a-zA-Z0-9_-]+)\b")
    id_pattern = re.compile(r"#\b([a-zA-Z0-9_-]+)\b")
    all_classes = set(class_pattern.findall(js_content))
    all_ids = set(id_pattern.findall(js_content))
    return all_classes, all_ids


# 선택자 분류
def classify_selectors(used_classes, used_ids, all_classes, all_ids):
    unused_classes = all_classes - used_classes
    unused_ids = all_ids - used_ids
    return {
        "unused_classes": unused_classes,
        "unused_ids": unused_ids,
    }


# 결과를 파일로 저장
def save_unused_selectors_to_file(output_file, unused_classes, unused_ids):
    with open(output_file, "w", encoding="utf-8") as file:
        file.write("Unused Classes:\n")
        file.writelines(f".{cls}\n" for cls in sorted(unused_classes))
        file.write("\nUnused IDs:\n")
        file.writelines(f"#{id_}\n" for id_ in sorted(unused_ids))


# 파일 경로 설정
html_folder = "C:\\Users\\backd\\Desktop\\git\\GhostSystem\\blog"  # HTML 파일 폴더 경로
style_css_path = "C:\\Users\\backd\\Desktop\\git\\GhostSystem\\blog\\css\\style.css"  # style.css 경로
main_js_path = (
    "C:\\Users\\backd\\Desktop\\git\\GhostSystem\\blog\\js\\main.js"  # main.js 경로
)

# 실행
html_files = [
    os.path.join(html_folder, f) for f in os.listdir(html_folder) if f.endswith(".html")
]
used_classes, used_ids = extract_used_selectors(html_files)

# CSS 분석
css_classes, css_ids = extract_css_selectors(style_css_path)
css_result = classify_selectors(used_classes, used_ids, css_classes, css_ids)
save_unused_selectors_to_file(
    "unused_in_style_css.txt", css_result["unused_classes"], css_result["unused_ids"]
)

# JS 분석
js_classes, js_ids = extract_js_selectors(main_js_path)
js_result = classify_selectors(used_classes, used_ids, js_classes, js_ids)
save_unused_selectors_to_file(
    "unused_in_main_js.txt", js_result["unused_classes"], js_result["unused_ids"]
)

print("HTML에서 사용되지 않은 CSS 선택자는 'unused_in_style_css.txt'에 저장되었습니다.")
print("HTML에서 사용되지 않은 JS 선택자는 'unused_in_main_js.txt'에 저장되었습니다.")
