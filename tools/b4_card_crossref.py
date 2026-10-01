#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""B4 重复卡裁定落地 v2：互引独立成行（论点行不动），index.json 加 crossref 字段。幂等。
先回滚 v1 追加到论点行的句子，再写入新格式。"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding="utf-8")

# v1 被错误追加到论点行末尾的句子（用于回滚）
V1_SENTENCES = {
    "card-ur-039": "与 ur-044 的分工：同族两面——那张讲「押内在之后怎么写」（聚焦一两点做到极致），这张讲「为什么值得押内在」；审人设先本卡定投入方向，再那张查是否散。",
    "card-ur-044": "与 ur-039 的分工：那张是立项期的资源分配结论，这张是执行期的聚焦纪律；同读一对，不重复。",
    "card-ns-035": "与 ns-093 分清：两个「三层」不同物——本卡（原型/萌属性/原动力）是生产侧配方，ns-093（内在/外在/行为）是接收侧转译验收；造完的三层要拿去问「在哪次具体行为里被玩家看见」，叠用不混用。",
    "card-ns-093": "与 ns-035 分清：那张是生产侧配方（原型/萌属性/原动力），本卡是接收侧转译验收；别把两个「三层」混为一谈，造完的三层要过本卡的「在哪次行为里被玩家看见」这道问。",
    "card-ns-065": "与 kl-068 同源互引：两份同出《从原神云堇看如何用传统文化反哺游戏IP》，kl-068 管立项姿势（翻译而非搬运，总纲），本卡管现场手法（降门槛两译法：形式置换+内容先行）；一个管立项一个管现场，两卡并读不互相替代。",
    "card-kl-068": "与 ns-065 同源互引：两份同出《从原神云堇看如何用传统文化反哺游戏IP》，本卡管立项姿势（总纲），ns-065 管现场手法（形式置换+内容先行两译法）；两卡并读不互相替代。",
}

# 新格式：独立互引行（放在论点行之后）
CROSSREF = {
    "card-ur-039": "ur-044｜资源分配 vs 聚焦纪律：本卡讲「为什么值得押内在」（立项期投入方向），那张讲「押内在之后怎么写」（聚焦一两点做到极致）；同族两面，两卡并读。",
    "card-ur-044": "ur-039｜聚焦纪律 vs 资源分配：本卡讲执行期怎么聚焦（忌堆相近正面词），那张讲立项期为什么押内在；同族两面，两卡并读。",
    "card-ns-035": "ns-093｜两个「三层」不同物：本卡（原型/萌属性/原动力）是生产侧配方，那张（内在/外在/行为）是接收侧转译验收；造完的三层要拿去问「在哪次具体行为里被玩家看见」，叠用不混用。",
    "card-ns-093": "ns-035｜转译验收 vs 生产配方：本卡（内在/外在/行为）管接收侧转译工序，那张（原型/萌属性/原动力）管生产侧三层配方；别把两个「三层」混为一谈，造完的三层要过本卡「在哪次行为里被玩家看见」这道问。",
    "card-ns-065": "kl-068｜同源材料两切面：两份同出《从原神云堇看如何用传统文化反哺游戏IP》；那张管立项姿势（「翻译而非搬运」总纲），本卡管现场手法（降门槛两译法：形式置换＋内容先行）；两卡并读，不互相替代；「与 ur-049 一致、形式置换的圈内风险、目标圈层反向保留硬核」三条判断以本卡为准。",
    "card-kl-068": "ns-065｜同源材料两切面：两份同出《从原神云堇看如何用传统文化反哺游戏IP》；本卡管立项姿势（「翻译而非搬运」总纲），那张管现场手法（降门槛两译法：形式置换＋内容先行）；两卡并读，不互相替代；原样复刻反例与两案克制/翻车细节见本卡批注。",
}

FILES = ["cards/用户研究.md", "cards/叙事设计.md", "cards/立项与发行.md"]


def process_md(path: Path):
    text = path.read_text(encoding="utf-8")
    ops = 0
    cids = [cid for cid in V1_SENTENCES.keys() if f"## {cid} " in text]
    for cid in cids:
        head = f"## {cid} "
        start = text.index(head)
        nxt = text.find("\n## card-", start + 1)
        end = nxt if nxt != -1 else len(text)
        block = text[start:end]
        # 回滚 v1
        if V1_SENTENCES[cid] in block:
            block = block.replace(V1_SENTENCES[cid], "")
            ops += 1
        # 写入互引行（论点行之后）
        sent = CROSSREF[cid]
        if f"- **互引**：{sent}" not in block:
            ai = block.index("- **论点**：")
            le = block.index("\n", ai)
            block = block[:le] + f"\n- **互引**：{sent}" + block[le:]
            ops += 1
        text = text[:start] + block + text[end:]
    path.write_text(text, encoding="utf-8")
    return ops


total = sum(process_md(ROOT / f) for f in FILES)

idx_path = ROOT / "cards" / "index.json"
idx = json.loads(idx_path.read_text(encoding="utf-8"))
cj = 0
for c in idx["cards"]:
    old = V1_SENTENCES.get(c["id"])
    if old and old in c["note"]:
        c["note"] = c["note"].replace(old, "")
    s = CROSSREF.get(c["id"])
    if s and c.get("crossref") != s:
        if "crossref" in c:
            c["crossref"] = s
        else:
            # 插在 note 之后、source 之前（保持 schema 字段阅读顺序）
            items = list(c.items())
            pos = next(i for i, (k, _) in enumerate(items) if k == "source")
            items.insert(pos, ("crossref", s))
            c.clear(); c.update(items)
            cj += 1
idx_path.write_text(json.dumps(idx, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"md ops={total}, index crossref={cj}")
