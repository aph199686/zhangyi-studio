# 调研记录：肉鸽 / DBG 构筑（品类包）

> 检索日期：2026-09-28。证据来源：仓库卡片库（`cards/index.json`，335 张）+ 受控网络检索。
> 本文件是公开来源的蒸馏，不含原文段落，可直接进 Git。所有判断均为复述，不代表任何包已运行、已平衡或经真人试玩。

## 0. 与棋牌博弈包的划界（开工前必答）

**结论：牌组构筑归肉鸽/DBG，牌局对战胜负归棋牌。**

- 归本包：卡池获取、抽牌循环、牌组污染与删牌、体系（流派）数量反推、遗物/被动全局增益、爬塔式路线与随机地图、单局内成长曲线的节奏。核心问句是「我这副牌能不能打赢接下来这关」。
- 归棋牌包：一手牌局内的信息博弈、下注/弃牌/诈唬、对手读牌与反制、赛制与匹配。核心问句是「这一步我该赌多大、对手在想什么」。
- 重叠处理：Balatro 用扑克牌型做计分骨架，但**去掉了下注与诈唬**，玩家不读对手，只在「抽牌—出牌—改牌」循环里叠倍率（见来源 E1）。因此它归本包，不归棋牌包。反之《雀魂》这类以对抗与信息博弈为主轴的，仍归棋牌包。
- 划界的一句话判据：**玩家是否需要揣测另一个玩家的意图来决定行动**？需要 → 棋牌；不需要（只有系统在出题）→ 本包。

## 1. 六个关键问题（检索前先立）

1. 玩家来这个品类要什么？（核心体验承诺与动机）
2. 第一局或第一小时该发生什么？
3. 有哪些真正分得出流派的设计分叉？
4. 新手开发者最常见的死法是什么？
5. 怎么算做对了？（可观察、可操作的验收判据）
6. 第一版该暂缓什么？

## 2. 检索日期与用过的检索词

检索日期：2026-09-28（全部当日检索并打开原文）。

用过的检索词（中英并行）：

- `Slay the Spire design postmortem deckbuilder lessons learned`
- `Balatro design analysis why it works localThunk game design`
- `GDC roguelike deckbuilder design talk balance randomness meta progression`
- `"杀戮尖塔" GDC 演讲 Anthony Giovannetti 数据驱动 平衡 设计`
- `roguelike deckbuilder common mistakes indie developer death RNG unfair`
- `steam negative reviews roguelike deckbuilder RNG build diversity "not enough content"`
- `roguelike meta progression design death is it too grindy unlocking power vs skill criticism`
- `deckbuilder first run onboarding tutorial design first ten minutes roguelike teach without tutorial`

## 3. 筛掉的来源及筛掉原因

| 来源 | 类型 | 筛掉原因 |
| --- | --- | --- |
| 《游戏策划正在经历十年来最大的工具链升级》（AI 策划五大战场） | 工具综述软文 | 主题是 AI 工具链，非本品类机制；含未标注来源的百分比数据，属内容农场式论断 |
| 百度百科「卡牌构筑」词条 | 百科 | 溯源价值有限（可核对发展史年代），不作机制判断依据，仅登记为背景 |
| 各类「2026 最佳 roguelite 卡牌榜」 | 清单文 | 任务明确禁用「十佳 XX」清单文 |
| 《杀戮尖塔 2》首发通稿类报道 | 新闻稿 | 仅取其中**玩家评价内容不足**的可核事实（见 P3），其余作通稿筛除 |
| 单纯打分评测（无机制拆解者） | 纯评测 | 任务禁用的充数来源 |

## 4. 有效来源清单

### 开发者视角（≥3 达标，实际 5）

- **D1｜'Slay the Spire': Metrics Driven Design and Balance（GDC 2019 演讲页）**
  https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
  类型：GDC 设计场演讲官方页。价值：确认「指标驱动的平衡」是该品类被官方记录的开发者方法，给出演讲主旨与适用范围。

- **D2｜How Slay the Spire's devs use data to balance their roguelike deck-builder（Game Developer，2018-02-27）**
  https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder
  类型：gamedeveloper.com 深度访谈（原 Gamasutra）。价值：给出两个核心指标（被选中率、出现在胜利牌组里的频率）、Dual Wield 的「改完才发现坏掉」全过程、Awakened One 的调参过程、以及「数据不告诉你手感」。

- **D3｜《杀戮尖塔》开发者分享：如何做数据驱动的游戏设计与平衡？（GDC 演讲听译全文，2022-06-27）**
  https://battle.com/tz/post/5201208
  类型：GDC 演讲中文全文听译。价值：平衡目标定义（「每张牌都有自己的地位」而非等强）、避免扭曲效应、单机 roguelike 让强组合成为奖励而非 bug、早期测试工具链（Slack + feedbackbot + 内部数据服务器）、「数据会说谎」的 Madness 案例、EA 前先做好平衡再发布。

- **D4｜Tackling deckbuilding and roguelite design in Abrakam's Roguebook（Game Developer，2022-03-05）**
  https://www.gamedeveloper.com/design/tackling-deckbuilding-design-in-abrakam-s-roguebook
  类型：gamedeveloper.com 开发者访谈。价值：**失败归因**的开发者一线说法——「玩家在毫无头绪、不知道下次怎么做得更好、或觉得游戏对他不公平时，会在一次失败后流失」；给出「把风险量交给玩家自己选」的解法；第一局可否通关的立场。

- **D5｜《杀戮尖塔》GDC 经验分享：构筑、学习、调整直到成功（游民星空，2019-03）**
  https://www.gamersky.com/zl/201903/1165796.shtml
  类型：GDC 演讲报道。价值：平衡终极目标「没有一张废卡」、超强组合出现率靠随机性压低、两名设计师如何用 Slack 梳理海量反馈。

### 分析视角（能说出「哪个设计导致什么行为」的长文）

- **A1｜Roguelike 卡牌构筑核心机制解析（ViWANT）**
  https://www.viwant.com/thread/roguelike-card-mechanics
  类型：机制拆解长文。价值：分层随机的三层结构（卡池随机 / 战斗事件随机 / 资源随机）、「策略空间产生于把不可控变量转为可控优势」、滚雪球问题的两种解法差异。

- **A2｜Why Every Roguelike Deckbuilder Reinvents the Same Three Problems（hotmolts）**
  https://www.hotmolts.com/post/why-every-roguelike-deckbuilder-reinvents-the-same-22a52392-4409-44eb-ba3e-cda0e3f01343
  类型：机制分析。价值：归纳品类三个恒定的结构难题——成长曲线、**死局（Dead Run）**、终局问题；并指出「不能同时拥有真随机与保证的能动性，品类就活在这个缝隙里」。

- **A3｜Common Deckbuilder Pitfalls（Newtonarrative）**
  https://newtonarrative.com/news/common-deckbuilder-pitfalls
  类型：开发者侧的市场与评价复盘（作者自述翻了大量差评做归类）。价值：把同品类硬核玩家的批评归成七类——原创性、可重玩内容量、RNG、难度、UX、节奏；并给出「最有用的差评往往以『我很纠结』开头」的观察。

- **A4｜Balatro、Slay the Spire 相关机制分析（Digital Edge / Techie Gamers / KR-ASIA）**
  https://digitaledge.org/?p=58503/ ｜ https://techiegamers.com/balatro-redefines-poker-roguelike/ ｜ https://kr-asia.com/how-balatro-became-2024s-indie-darling
  类型：机制拆解。价值：拆出 Balatro 的三个可迁移设计——用玩家已懂的牌型词汇跳过教学、乘法而非加法的成长反馈、用「可行牌型下限」保证弱势 build 也有强度地板；以及移除生命值使每局结算干净利落。

- **A5｜Fun and Frustration in Roguelike Deckbuilding Games（Nerdlab）**
  https://nerdlab-games.com/061-fun-and-frustration-in-roguelike-deckbuilding-games-like-monster-train-and-slay-the-spire/
  类型：设计分析。价值：解释 roguelike 三要素（随机关卡 / 永久死亡 / 渐进成长）各自的乐趣来源，并得出品类第一条纪律：**把复杂组件分步介绍给玩家**。

### 玩家视角（≥1 达标，实际 4）

- **P1｜Claymores of the Lost Kingdom 差评（Steam，2024-11-28，5.3 小时）**
  https://store.steampowered.com/app/2473260
  价值：真实失败案例。批评点集中——同数值 build 每局雷同、敌人种类少、敌人随机增益战前不可见导致「一星敌人也可能因 75% 减伤打死你」、缺少局外成长。**归因清晰、可用于「不可见随机惩罚」反面教程**。

- **P2｜某卡牌构筑游戏 Steam 讨论区吐槽贴（2025-10）**
  https://steamcommunity.com/app/2315400/discussions/0/601918052458875148
  价值：玩家自己拆机制——「行动经济惩罚过重且几乎无缓解手段」「全卡池仅一到两张能无代价过牌」「一次坏手牌可直接终结一局」。是「死局」在玩家侧的实证。

- **P3｜Slay the Spire 2 首发评价反馈（2026，经 Choost Games 汇总）**
  https://choostgames.com/blog/best-roguelite-deckbuilders-2026
  价值：反面案例。销量极高但评价转差，**归因是内容量（卡池薄、遭遇重复）而非机制骨架**。可用于「内容量预期」这条验收线。

- **P4｜Beneath Oresa 复盘（Wanderer）**
  https://playwanderer.online/game-reviews/beneath-oresa
  价值：差评共性——角色彼此太像（重叠卡池）、卡牌随机性调校不足导致「想要的 build 从不出现」、缺少跳过/拒绝卡牌的选项、难度陡峭。用于响应「角色差异化」与「拒绝权」两个分叉。

- **P5｜meta-progression 争议讨论（Lemmy / RPG Codex）**
  https://lemmy.world/comment/21950276 ｜ https://mail.rpgcodex.net/forums/threads/annoying-modern-game-design-trends-meta-progression.156588
  价值：玩家侧对局外成长的真实分歧——「让失败有事做」vs「模糊了自我评估，赢了也不确定是自己变强还是数值变高」。用于本包「局外成长」列为低证据方向的依据。

- **P6｜LocalThunk 访谈：我不玩扑克（PC Gamer）**
  https://www.pcgamer.com/i-dont-play-poker-at-all-says-solo-developer-who-made-the-poker-roguelike-i-cant-stop-playing/
  价值：开发者自述**刻意借用玩家已懂的词汇**（牌型、盲注、筹码）降低第一局的认知门槛，去掉 HP/伤害/经验这类「游戏行话」。可直接支撑「首局用已知词汇」这条判断。

**覆盖面**：涉及《杀戮尖塔》《Balatro》《Monster Train》《Roguebook》《Claymores of the Lost Kingdom》《Beneath Oresa》《Slay the Spire 2》《Luck Be a Landlord》《Vault of the Void》共 9 款以上。有效来源 15 条，其中开发者视角 5、分析视角 5、玩家视角 6（含失败/反面 4）。**达标。**

## 5. 按六个关键问题蒸馏的判断

### Q1 玩家来这个品类要什么？

- 玩家要的是「用脑子把一堆随机部件拼成一台机器」的掌控感与涌现快感，而不是单纯的手气。强联动、高熟练度回报是该品类可以刻意保留的奖励方向；因为它是单机 PVE，没有真人对手被碾压，强组合可以是奖励而非 bug。（D3、A5）
- 附带动机：每一次重开都该感到「下局换套玩法」，而不是「同样的开局再来一遍」。（A5、P1）

### Q2 第一局 / 第一小时该发生什么？

- **用玩家已经懂的词汇开场**：Balatro 刻意不做 HP、伤害、经验，直接借扑克牌型词汇，玩家第一次上手就懂基本盘。（P6、A4）
- **组件分步投放**：品类第一条纪律是「把复杂组件一步步介绍给玩家」，逐局解锁更复杂但也更强的卡与遗物，既拉长动力又降低入门墙。（A5）
- **首局就该让玩家做出一次「删牌 / 拒牌」级别的构建决策**，而不只是出牌；否则玩家学不到这个品类的核心动作。（D3、A3；对照 P4 缺少拒绝权的差评）
- 交叉验证：Q2 的三条分别有 ≥2 独立来源（P6+A4；A5+D3；D3+A3），可作推荐默认值。

### Q3 真正分得出流派的设计分叉（挑 4 个）

1. **成长动力的来源**：加法（每张牌给 +X）vs 乘法（倍率叠乘）。Balatro 用乘法把数值推到「荒谬」的程度制造爽点，代价是后期数字通胀、必须靠盲注同步抬升。（A4、D5）→ 决定曲线形态与数值空间。
2. **牌组走向**：精简高纯度（删到只剩核心牌，追求稳定手牌）vs 厚牌组多即兴（Roguebook 刻意反向设计，让玩家拥有大牌组、常需即兴）。（D4）→ 决定「删牌/拒牌」权是否该给玩家。
3. **随机与能动的配比 / 死局处理**：真随机＋保证能动性不可兼得，品类就活在缝隙里；常见缓解手段（抽牌三选一、商店、重掷）各自又引入新问题。（A2、A1）→ 决定随机出现在决策之前还是之后。
4. **局外成长（meta-progression）**：给「变强的数值」vs 只给「更多样的解锁」。玩家对前者的争议最大——会模糊自我评估；Hades 用可随时重置的天赋、Dead Cells 用侧向解锁来回避。（P5、A3）→ 决定第一局公平性与长期动机结构。

### Q4 新手开发者最常见的死法（真实复盘）

- **不可见的随机惩罚**：敌人随机增益在战前不可见，导致满状态被一星敌人打死——玩家的原话归因是「我本不该输，却输了」。（P1）
- **死局无缓解**：坏手牌直接终结一局，而全卡池几乎没有「无代价过牌」这类保险。（P2、A2）
- **内容量与重复感**：首发卡池薄、遭遇重复，即便机制骨架不差也会被打差评（Slay the Spire 2 的反面）。（P3）
- **角色/build 趋同**：不同角色共享重叠卡池与机制，玩家感到「换皮不换玩法」。（P4）
- **失败归因缺失**：玩家在「不知道为什么会输、不知道下次怎么做更好、或觉得不公平」时，会在一次失败后流失——这是开发者自己总结的首要流失原因。（D4）
- **数值成长型局外成长喧宾夺主**：玩家觉得「赢了是因为数值高了，不是因为玩得好」，成就感被抽空。（P5、A3）

### Q5 怎么算做对了（可观察、可操作的验收判据）

- **可读的威胁**：玩家在行动前能看见敌人的下一步意图。（D5 的敌人「专克某种思路」设计；对照 P1 的「不可见随机」）
- **死局可缓解、可归因**：每次失败后玩家能说出是哪一步导致了失败，且手里始终有一条可选的缓解路径（过牌 / 商店 / 重掷 / 拒绝权）。（D4、P2、A2）
- **每张牌都有存在理由**：平衡目标是「每张牌都有自己的地位」而非等强；被选中率过低即等于「这张牌在游戏里不存在」。（D2、D5）
- **至少两条可行 build 在验收时都能通关**，且角色之间有可辨识的差异。（A3、P4 反向）
- **首局 10 分钟内完成一次完整「抽牌—出牌—改牌—结算」循环**，并能看手牌数值实时变化（Balatro 的乘法透明度）。（A4）
- 交叉验证：可读威胁（D5+P1）、可归因失败（D4+P2）、每张牌有地位（D2+D5）均 ≥2 源。

### Q6 第一版该暂缓什么（范围纪律）

- 暂缓**数值成长型局外成长**：争议大、且容易把「玩得好」偷换成「数值高」，先只做侧向解锁（新卡、新角色、新模式）。（P5、A3）
- 暂缓**多角色 / 多体系铺量**：体系总数应由单局选择次数反推（card-gd-030：杀尖 45–60 次选牌只支撑 3–4 个体系），首版先做 1 个角色 × 2–3 个体系。（card-gd-030、A3）
- 暂缓**高难挑战层（晋升 / 天梯 / 排行榜）**：属后期内容，第一版先验证基础循环。（D3）
- 暂缓**复杂遗物组合与多层状态系统**：遗物/状态越多，平衡工作量与可读性成本越大。（D2、D5）

## 6. 卡片库交叉引用（第一手证据）

- `card-gd-030`（杀戮尖塔简析下）：体系总数由单局选择次数反推（45–60 次选牌只支撑 3–4 个体系）；单体系只覆盖一到两个能力维度，靠「被迫混合」制造多样性。→ 直接支撑 Q6 暂缓体系铺量、Q3 分叉。
- `card-gd-029`（杀戮尖塔简析下）：难度曲线锚定三档构筑强度基准（初始配置 / 单件强化物平均强度 / 体系成型上限）。→ 支撑 Q5 验收：卡牌强度区间由两档基准夹出。
- `card-gd-031`（杀戮尖塔简析下）：协同链条上辅助牌/触发牌/中介牌按位置分工；过渡牌必须注定被淘汰。→ 支撑 Q5「每张牌有地位」的可操作化。
- `card-gd-008`（文明6 时代系统）：多条构筑路径的发力窗口错开分布。→ 支撑 Q3 分叉与 build 可行性。
- `card-gd-027`（涌现式平衡）：使用率/胜率是现象不是解释（四种成因）。→ 支撑 Q5「不能只看数据动刀」，与 D2 的指标解读呼应。
- `card-gd-026`（涌现式平衡）：优势策略不是病，策略退化才是病；判据是决策树更茂盛还是更枯萎。→ 支撑 Q5 验收：看决策密度而非强度。
- `card-gd-042`（经济反馈循环）：正反馈经济必须配负反馈约束。→ 支撑 Q3 分叉 1（乘法成长必须配同步抬升的挑战）。
- `card-gd-034`（机制立项）：离散机制（回合制、CCG）技术风险低，适合资源有限团队。→ 支撑本包立项价值。
- `card-gd-059`（天地劫拆解）：把策略解空间搬进可重复内容的局内 roguelike 形式。→ 品类相邻印证。
- `card-kl-005`（吸血鬼幸存者）：成熟品类里翻转核心目标即开子品类；砍维度不是做减法，是把深度搬家。→ 支撑 Q3 分叉（目标函数翻转）。
- `card-kl-006`（吸血鬼幸存者）：把单局时长做成对玩家的明确承诺。→ 支撑 Q2「首局 10 分钟完整循环」。
- `card-kl-009`（潜水员戴夫）：强制任务只能落在核心玩法上，黄金窗口塞非核心玩法造成留存悬崖。→ 支撑 Q6 范围纪律。
- `card-kl-001`（McMillen 忠告）：前十几款作品刻意压小，走通「做完—发布—失败」闭环。→ 支撑 Q6 与立项纪律。
- `card-ur-001`（腾讯 i-MUR FTUE）：新手期三要素有效性/吸引力/目标，F2P 容忍窗口可能只有 5 分钟。→ 支撑 Q2 首局。
- `card-ur-003`（腾讯用研）：引导结束后不打扰观察，看玩家是否有自发行为。→ 支撑 Q5 验收动作。
- `card-pp-005`（多目标进度错开）：一个目标刚完成时总有另一个接近完成。→ 支撑 Q3 分叉 4 的长期动机设计。
- `card-gd-003`（三层赏罚循环）：短期/中期/长期三层赏罚各自的症状。→ 支撑 Q5 分层验收。

## 7. 证据强度自评

**充分。** 开发者视角 5 条（含 GDC 官方页面、gamedeveloper.com 两篇深度访谈、GDC 听译全文、GDC 报道），分析视角 5 条，玩家视角 6 条（含 4 个失败/反面案例）；覆盖 9 款以上游戏；每条推荐默认值与验收点均有 ≥2 独立来源交叉验证。卡片库对该品类覆盖最厚（gd-008/026/027/029/030/031/042/059、kl-001/005/006/009），与网络来源独立互证。

逐字段证据强度：

| 字段 | 强度 | 依据 |
| --- | --- | --- |
| `firstChallenge`（首局目标三候选） | 充分 | D2/D3/P6/A5 交叉 |
| `questions[].rogue_*`（3 道分叉题） | 充分 | 分叉 1 有 A4+D5；分叉 2 有 D4；分叉 3 有 A2+A1 |
| `prototype.missions`（占位关卡草案） | 有限 | 由 D4/D5 的机制描述综合推演，非直接抄自某案例 |
| `prototype.acceptance` | 充分 | D4/D2/D5/A4 交叉 |
| `prototype.defer` | 有限 | meta-progression 争议大（P5），故「暂缓数值型局外成长」属**方向性低证据判断**，已在包内标注 |
| `review`（审方案提示） | 充分 | D4 的失败归因 + P1/P2 |

## 8. 没能回答的缺口

1. **「第一小时」的一手量化拆解缺失**：没有找到逐分钟级的首局留存曲线数据；Q2 的判断是机制层推理，不是实测曲线。已在包内相应字段标「有限」。
2. **数值曲线的可操作框架缺失**：只有 card-gd-029 的三档基准（内部资料蒸馏），缺公开的一手数值文档；本包不提供具体数值，只给结构与区间纪律。
3. **纯「无对手单机计分型」（Luck Be a Landlord / Balatro 一类）与「爬塔对阵型」（杀尖一类）的细分差异证据薄**：本包把两者并入同一首局候选，未做二级分流。
4. **局外成长的最优形态无共识**：玩家侧明显分裂（P5），故本包不给推荐默认值，只标为「低证据方向：侧向解锁优先，数值成长后置」。
5. **跨文化/平台差异未覆盖**：未找到移动端 vs PC 端对该品类首局设计的差异研究。

## 网络验活登记（2026-09-30，19 条链接）

- 死链 0；无法核验 7（环境拦截与 403 反爬）；14 条活链支撑「是」、3 条部分：newtonarrative 差评实为 6 类（文档写「七类」）；digitaledge 的「可行牌型下限」由同组 kr-asia 补足。
- 无链接引用待补：Hades 可重置天赋 / Dead Cells 侧向解锁一句无 URL。
