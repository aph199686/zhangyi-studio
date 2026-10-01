#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""接线层生成器：把 cards/index.json 按阶段标签编译进各阶段 skill 的
references/cards-<阶段>.md，让评审时能按需 Grep 加载卡片（渐进披露）。

用法：在仓库根目录跑 python tools/build_skill_cards.py
卡片库更新后重跑本脚本并同步 skills 到用户目录。
"""
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MAP = {
    "zhangyi-kickoff": "立项",
    "zhangyi-systems": "机制",
    "zhangyi-narrative": "叙事",
    "zhangyi-probe": "验证",
    "zhangyi-playtest": "验证",
    "zhangyi-review": "收尾",
}

USAGE = """<!-- 本文件由 tools/build_skill_cards.py 从 cards/index.json 生成，勿手改。
用法（渐进披露）：评审时不要通读本文件。用 Grep 以本次病灶/支柱/方案的
主题关键词（如"难度曲线""角色塑造""经济系统"）检索本文件，只读命中卡片
（单次评审建议 ≤6 张）。裁决时引用卡片编号；无命中则不引用。 -->
"""


def block(c):
    s = c["source"]
    url = s["url"]
    link = f"[《{s['title']}》]({url})" if url.startswith("http") else f"《{s['title']}》（{url}）"
    date = s.get("date") or ""
    tail = f" · {date}" if date else ""
    crossref = f"- **互引**：{c['crossref']}\n" if c.get("crossref") else ""
    return (
        f"## {c['id']} · {c['claim'][:24]}……\n\n"
        f"- **论点**：{c['claim']}\n"
        f"{crossref}"
        f"- **场景**：{' / '.join(c['scenarios'])}\n"
        f"- **批注**：{c['note']}\n"
        f"- **出处**：{link} · {s['platform']}{tail}\n"
    )


def main():
    idx = json.loads((ROOT / "cards" / "index.json").read_text(encoding="utf-8"))
    by_stage = defaultdict(list)
    for c in idx["cards"]:
        for st in c["scenarios"]:
            if st in MAP.values():
                by_stage[st].append(c)
    for skill, stage in MAP.items():
        cards = sorted(by_stage[stage], key=lambda c: c["id"])
        out = USAGE + f"\n# 卡片库 · {stage}阶段（{len(cards)} 张）\n\n"
        out += "\n".join(block(c) for c in cards)
        dest = ROOT / "skills" / skill / "references" / f"cards-{stage}.md"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(out, encoding="utf-8")
        print(f"{skill}/references/cards-{stage}.md ← {len(cards)} 张")


if __name__ == "__main__":
    main()
