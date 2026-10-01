#!/usr/bin/env python3
"""张翼 skill 校验器。用法：python tools/validate.py（在仓库根目录运行）。

检查项：
1. 每个 skills/*/SKILL.md 的 frontmatter：name/description 齐全，description 中英双语且含触发词
2. SKILL.md 正文行数 <= 500
3. 正文引用的 references/ 文件存在
4. cards/ 版权红线扫描：卡片文件中单行引用不得超过 50 字（引号内）
5. 品牌水印一致性：templates 与 SKILL.md 中出现的水印格式统一
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors = []
warnings = []

def err(msg):
    errors.append(msg)

def warn(msg):
    warnings.append(msg)

WATERMARK = "张翼 Spread the Pinions ·"

def check_skill(skill_dir: Path):
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        err(f"{skill_dir.name}: 缺 SKILL.md")
        return
    text = skill_md.read_text(encoding="utf-8")
    lines = text.splitlines()

    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        err(f"{skill_dir.name}: 缺 frontmatter")
    else:
        fm = m.group(1)
        if not re.search(r"^name:\s*\S+", fm, re.M):
            err(f"{skill_dir.name}: frontmatter 缺 name")
        dm = re.search(r'^description:\s*"(.*)"', fm, re.S | re.M)
        if not dm:
            err(f"{skill_dir.name}: frontmatter 缺 description")
        else:
            desc = dm.group(1)
            if not re.search(r"[一-鿿]", desc):
                err(f"{skill_dir.name}: description 缺中文触发词")
            if not re.search(r"[A-Za-z]{4,}", desc):
                err(f"{skill_dir.name}: description 缺英文触发词")
            if len(desc) > 600:
                warn(f"{skill_dir.name}: description 偏长（{len(desc)} 字符），建议精简")

    body = len(lines)
    if body > 500:
        err(f"{skill_dir.name}: SKILL.md {body} 行，超过 500 行上限")

    for ref in re.findall(r"\]\((references/[^)]+)\)", text):
        if not (skill_dir / ref).exists():
            err(f"{skill_dir.name}: 引用的 {ref} 不存在")

def check_cards():
    cards_dir = ROOT / "cards"
    for f in sorted(cards_dir.glob("*.md")):
        if f.name == "SCHEMA.md":
            continue
        for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for quote in re.findall(r"“([^”]+)”", line):
                if len(quote) > 50:
                    err(f"cards/{f.name}:{i}: 引号内文本 {len(quote)} 字，超过 50 字版权红线")
            if len(line) > 300 and "出处" not in line:
                warn(f"cards/{f.name}:{i}: 单行 {len(line)} 字，人工确认是否为原文粘贴")
    idx = cards_dir / "index.json"
    if idx.exists():
        try:
            data = json.loads(idx.read_text(encoding="utf-8"))
            cards = data if isinstance(data, list) else data.get("cards", [])
            ids = [c.get("id") for c in cards]
            if len(ids) != len(set(ids)):
                err("cards/index.json: 存在重复 id")
            for c in cards:
                for field in ("id", "claim", "scenarios", "note", "source", "added"):
                    if field not in c:
                        err(f"cards/index.json: {c.get('id','?')} 缺字段 {field}")
        except json.JSONDecodeError as e:
            err(f"cards/index.json: JSON 解析失败 {e}")

def check_brand():
    for f in list(ROOT.glob("templates/*.md")) + list(ROOT.glob("skills/**/*.md")):
        text = f.read_text(encoding="utf-8")
        for m2 in re.finditer(r"张翼\s+Spread\s+the\s+[Pp]inions", text):
            pass  # 存在即可
    tpl = ROOT / "templates" / "立项裁决书.md"
    if tpl.exists() and WATERMARK not in tpl.read_text(encoding="utf-8"):
        err("templates/立项裁决书.md: 缺品牌水印")

def main():
    skills_dir = ROOT / "skills"
    skill_dirs = [d for d in skills_dir.iterdir() if d.is_dir()]
    if not skill_dirs:
        err("skills/ 下没有任何 skill")
    for d in sorted(skill_dirs):
        check_skill(d)
    check_cards()
    check_brand()

    for w in warnings:
        print(f"[warn] {w}")
    if errors:
        for e in errors:
            print(f"[FAIL] {e}")
        print(f"\n{len(errors)} 个错误，{len(warnings)} 个警告")
        sys.exit(1)
    print(f"全部通过：{len(skill_dirs)} 个 skill，{len(warnings)} 个警告")

if __name__ == "__main__":
    main()
