# AI 小说写作工作流（AI Novel Writing Workflow）

## 1. 使用目标（Goal）

这份工作流用于把“用 AI 写小说”从一次性提示词（Single Prompt）改造成长期项目（Long-running Project）。它适合四类场景：

- 从 0 开始写一本长篇小说（Long-form Novel）。
- 已经有部分章节，希望继续写并保持一致性。
- 想学习某类小说、某种题材或某种文风，并提取规律。
- 未来把流程整理成 `novel-writing-workflow` skill。

优先建议：先试用 InkOS。InkOS 已经提供长篇小说（Long-form Novel）、章节流水线（Chapter Pipeline）、审稿修订（Audit / Revise）、真相文件（Truth Files）和上下文治理（Context Governance）。如果它满足你的使用习惯，可以围绕 InkOS 建立个人 SOP；如果不满足，再使用本文的自建目录化工作流。

## 2. 核心原则（Core Principles）

1. 先管理项目，再生成正文。
   - 小说不是“让 AI 写一章”这么简单，而是持续管理人物、设定、关系、伏笔、章节目标和风格。

2. 真相源（Truth Source）优先于聊天历史。
   - 聊天记录只能辅助理解；真正可信的是落盘文件。

3. 每章都必须有章节意图（Chapter Intent）。
   - 没有章节意图就写正文，会导致章节水化、偏题和伏笔遗失。

4. 上下文包（Context Package）只读取本章需要的材料。
   - 不把全部设定塞进 prompt；只选本章相关的人物、世界观、伏笔、上一章摘要和当前焦点。

5. 没有审稿（Audit）不声明章节完成。
   - AI 说“已完成”不算完成；必须有审稿记录。

6. 状态结算（State Settlement）先于下一章。
   - 每章完成后要更新人物变化、关系变化、伏笔状态、世界观变化和下一章焦点。

7. 风格学习（Style Learning）只提取规律，不复制表达。
   - 学习参考作品时，提取结构、节奏、句式和叙事策略，不照搬原文。

## 3. 小说项目目录结构（Novel Project Workspace）

每本小说使用一个目录，例如：

```text
novels/<book-slug>/
├── index.md
├── origin/
│   ├── index.md
│   └── 2026-07-07-initial-idea.md
├── intent/
│   ├── index.md
│   ├── author-intent.md
│   └── current-focus.md
├── bible/
│   ├── index.md
│   ├── premise.md
│   ├── themes.md
│   └── constraints.md
├── worldbuilding/
│   ├── index.md
│   ├── cosmology.md
│   ├── power-system.md
│   ├── geography.md
│   ├── factions.md
│   └── timeline.md
├── characters/
│   ├── index.md
│   ├── protagonist.md
│   ├── antagonist.md
│   └── supporting/
├── relationships/
│   ├── index.md
│   ├── relationship-map.md
│   └── conflicts.md
├── outline/
│   ├── index.md
│   ├── whole-book.md
│   ├── volume-01.md
│   └── chapter-plan.md
├── hooks/
│   ├── index.md
│   ├── active-hooks.md
│   ├── resolved-hooks.md
│   └── debt.md
├── chapters/
│   ├── index.md
│   └── chapter-001/
│       ├── index.md
│       ├── intent.md
│       ├── context.md
│       ├── draft.md
│       ├── audit.md
│       ├── revision.md
│       └── settlement.md
├── style/
│   ├── index.md
│   ├── style-guide.md
│   ├── reference-analysis.md
│   └── forbidden-patterns.md
├── research/
│   ├── index.md
│   └── sources/
└── handoffs/
    ├── index.md
    └── 2026-07-07-session.md
```

各目录职责：

| 目录 | 存什么 | 什么时候读 | 什么时候更新 | 恢复热路径（Resume Hot Path） |
| --- | --- | --- | --- | --- |
| `origin/` | 原始想法、用户口述、参考需求 | 追溯最初动机时 | 用户追加新想法时 | 否 |
| `intent/` | 作者意图（Author Intent）、当前焦点（Current Focus） | 每次写作前 | 方向变化、章节完成后 | 是 |
| `bible/` | 故事核心、主题、禁区、硬约束 | 规划和重大修订时 | 核心设定变化时 | 是 |
| `worldbuilding/` | 世界规则、地理、势力、历史、能力体系 | 本章涉及相关设定时 | 新设定确认后 | 视章节而定 |
| `characters/` | 人物档案（Character Bible） | 人物出场或做关键选择时 | 人物发生变化后 | 视章节而定 |
| `relationships/` | 人物关系（Relationship Map）和冲突 | 写关系戏、背叛、联盟时 | 关系变化后 | 视章节而定 |
| `outline/` | 总纲、卷纲、章节计划 | 规划章节时 | 大纲调整后 | 是 |
| `hooks/` | 伏笔账本（Hook Ledger） | 每章规划和审稿时 | 每章结算后 | 是 |
| `chapters/` | 章节意图、上下文、初稿、审稿、修订、结算 | 写当前章和恢复上下文时 | 每章推进时 | 是 |
| `style/` | 文风规则、样例分析、禁用模式 | 写作和修订时 | 风格学习或风格漂移后 | 视任务而定 |
| `research/` | 外部资料、来源、事实核查 | 世界观/职业/年代调研时 | 调研后 | 否 |
| `handoffs/` | 跨会话交接 | 中断恢复时 | 暂停前 | 是 |

## 4. `index.md` 索引规则（Index Rules）

每个目录必须有 `index.md`。它不存全部细节，只告诉 AI 和人类“这里有什么、什么时候读、什么时候改”。

标准模板：

```markdown
# [目录名称] 索引（[English Name] Index）

- 用途：

- 文件列表：

- 恢复热路径（Resume Hot Path）：

- 深度追溯路径（Deep Trace Path）：

- 读取规则（Read Rules）：

- 更新规则（Update Rules）：

- 最近变更（Recent Changes）：
```

读取规则（Read Rules）：

- 默认只读项目总 `index.md`、`intent/current-focus.md`、`chapters/index.md`、`hooks/index.md`。
- 写章节时先读 `chapters/chapter-XXX/intent.md`，再按章节意图选择上下文。
- 人物只在本章出场或影响决策时读取具体人物文件。
- 世界观只在本章涉及规则、地点、势力、历史或能力体系时读取具体文件。
- 伏笔账本每章必读，但只处理活跃伏笔和拖欠伏笔。
- 禁止无条件全量读取全部资料。

更新规则（Update Rules）：

- 新增分文档后，必须更新所在目录的 `index.md`。
- 章节完成后，必须更新 `chapters/index.md`、`hooks/index.md`、相关人物和世界观索引。
- 长期变化写入分文档，摘要写入 `index.md`。
- 如果 `index.md` 变长，历史记录移入分文档或 `handoffs/`，保留热路径短小。

## 5. 阶段一：对齐（Align）

目标：确认这本小说到底要写什么。

输入：

- 原始想法（Initial Idea）
- 参考作品（Reference Works）
- 题材偏好（Genre Preference）
- 目标读者（Target Readers）
- 风格偏好（Style Preference）
- 禁区（Constraints）

输出：

```text
origin/index.md
origin/<date>-initial-idea.md
intent/author-intent.md
bible/premise.md
bible/constraints.md
```

必须回答：

- 这本书是什么题材？
- 读者为什么想继续看？
- 核心情绪是什么：爽、悬疑、恐惧、浪漫、成长、复仇，还是别的？
- 主角最核心的欲望是什么？
- 不写什么：不写哪些桥段、价值观、尺度或题材雷区？
- 是长篇、短篇、连载，还是实验文本？

门禁：

- 没有作者意图（Author Intent）不进入计划（Plan）。
- 没有禁区（Constraints）不开始正文。

## 6. 阶段二：计划（Plan）

目标：形成可执行的大纲与写作路径。

输出：

```text
outline/index.md
outline/whole-book.md
outline/volume-01.md
outline/chapter-plan.md
intent/current-focus.md
```

推荐方法：

- 雪花法（Snowflake Method）：从一句话故事核心扩展到整本书结构。
- 节拍表（Beat Sheet）：标记结构节点和情绪转折。
- 3-5 章小周期（Mini Arc）：每 3-5 章至少推进一个目标、冲突或悬念。

`outline/whole-book.md` 应包含：

- 一句话核心（One-sentence Premise）
- 故事摘要（Story Summary）
- 主线（Main Plot）
- 关键转折（Major Turns）
- 结局方向（Ending Direction）

`outline/volume-01.md` 应包含：

- 本卷目标
- 本卷主冲突
- 本卷主要人物变化
- 本卷要埋和要收的伏笔

`outline/chapter-plan.md` 应包含：

- 章节编号
- 章节目标
- 出场人物
- 信息变化
- 关系变化
- 伏笔动作

门禁：

- 没有大纲（Outline）不进入章节执行（Apply）。
- 没有当前焦点（Current Focus）不生成下一章。

## 7. 阶段三：真相源建设（Truth Source）

目标：建立后续章节必须遵守的事实与规则。

### 7.1 故事圣经（Story Bible）

`bible/premise.md` 记录故事核心。它应该短，回答“这本书到底在讲什么”。

`bible/themes.md` 记录主题，例如自由、复仇、成长、秩序、信任、阶层跃迁。

`bible/constraints.md` 记录不可违反的硬约束，例如：

- 主角不能无故变成另一个人。
- 能力体系不能无代价升级。
- 某角色不能提前死亡。
- 不写某类桥段。

### 7.2 世界观（Worldbuilding）

世界观资料库至少包含：

- 能力体系（Power System）：能力来源、成长路径、代价、限制、克制关系。
- 地理（Geography）：地点、距离、交通、资源。
- 势力（Factions）：组织目标、利益、冲突。
- 历史时间线（Timeline）：过去事件如何影响现在。
- 规则限制（Rules / Limits）：哪些事情能做，哪些事情做不到。

新增设定流程：

```text
提出设定
→ 检查是否冲突
→ 写入 worldbuilding/ 对应文件
→ 更新 worldbuilding/index.md
→ 章节中使用
```

### 7.3 人物与关系

人物档案（Character Bible）至少记录：

- 欲望（Desire）
- 恐惧（Fear）
- 误信念（Misbelief）
- 行动逻辑（Action Logic）
- 人物语气（Character Voice）
- 人物弧光（Character Arc）
- 禁止行为（Forbidden Behavior）

人物关系（Relationship Map）至少记录：

- 两人当前关系
- 冲突点
- 利益关系
- 历史事件
- 关系变化记录

### 7.4 伏笔账本（Hook Ledger）

伏笔账本（Hook Ledger）使用五种状态：

- open：新开伏笔。
- advance：推进伏笔。
- resolve：兑现伏笔。
- defer：延期伏笔。
- debt：拖欠伏笔，需要尽快处理。

每章规划时必须回答：

- 本章新开什么伏笔？
- 本章推进什么伏笔？
- 本章兑现什么伏笔？
- 哪些伏笔延期，为什么延期？
- 有没有 debt 超过 3-5 章没有处理？

## 8. 阶段四：章节执行（Apply）

单章目录：

```text
chapters/chapter-001/
├── index.md
├── intent.md
├── context.md
├── draft.md
├── audit.md
├── revision.md
└── settlement.md
```

单章流水线：

```text
章节意图（Chapter Intent）
→ 上下文包（Context Package）
→ 初稿（Draft）
→ 审稿（Audit）
→ 修订（Revise）
→ 状态结算（State Settlement）
```

### 8.1 章节意图（Chapter Intent）

`intent.md` 必须包含：

- 本章目标（Chapter Goal）
- 本章读者期待（Reader Expectation）
- 该兑现的内容（Payoff）
- 暂不掀的内容（Keep Buried）
- 本章人物选择（Character Choice）
- 章尾必须发生的改变（End-of-chapter Change）
- 本章伏笔账（Hook Ledger）
- 不要做（Do Not）

### 8.2 上下文包（Context Package）

`context.md` 只收录本章需要的材料：

- 当前焦点（Current Focus）
- 上一章摘要
- 本章出场人物档案
- 本章涉及的世界观文件
- 本章活跃伏笔
- 本章需要遵守的风格规则

禁止：

- 把所有人物全塞进去。
- 把全部世界观全塞进去。
- 把几十章正文全塞进去。
- 让 AI 自己猜需要什么上下文。

### 8.3 初稿（Draft）

`draft.md` 只负责落地章节意图。

规则：

- 不能新增未登记的核心设定。
- 不能跳过本章伏笔账。
- 不能改变已确认的人物动机。
- 不能为了爽点牺牲因果。
- 章尾必须有信息变化、关系变化、物理变化或权力变化之一。

## 9. 阶段五：审稿与修订（Review / Revise）

### 9.1 审稿清单（Audit Checklist）

`audit.md` 至少检查：

- 人物一致性（Character Consistency）：人物行为是否符合欲望、恐惧、经历和利益。
- 世界观一致性（Worldbuilding Consistency）：是否违反能力体系、地理、历史、组织规则。
- 章节目标达成（Chapter Goal Completion）：本章目标是否真的完成。
- 伏笔账对应（Hook Ledger Alignment）：intent 里的 open / advance / resolve / defer 是否落到正文。
- 文风漂移（Style Drift）：是否偏离 `style/style-guide.md`。
- 节奏与密度（Pacing / Density）：是否存在长段无信息变化。
- 对话有效性（Dialogue Function）：对话是否推进冲突、信息或关系。

### 9.2 修订（Revise）

修订类型：

- 润色（Polish）：只改表达、节奏、段落呼吸，不改事实。
- 定点修复（Spot Fix）：只改审稿指出的问题句或问题段。
- 改写（Rewrite）：重写问题段落，但保留事实和目标。
- 重构（Rework）：调整场景结构、冲突顺序或章节组织。

修订规则：

- 先修关键问题，再修表达。
- 人设、世界观、伏笔问题优先于文风。
- 修订后必须重新审稿。
- 如果修订改动了事实，必须进入状态结算。

## 10. 阶段六：验证与结算（Verify / State Settlement）

状态结算（State Settlement）回答：这一章发生后，项目资料库要怎么变？

章节完成后更新：

- `chapters/index.md`：新增章节摘要和状态。
- `chapters/chapter-XXX/settlement.md`：记录本章结算。
- `hooks/active-hooks.md`：更新仍活跃的伏笔。
- `hooks/resolved-hooks.md`：记录已兑现伏笔。
- `hooks/debt.md`：记录拖欠伏笔。
- `characters/*.md`：更新人物变化。
- `relationships/*.md`：更新关系变化。
- `worldbuilding/*.md`：更新确认的新设定。
- `intent/current-focus.md`：写下一章焦点。

`settlement.md` 模板：

```markdown
# 第 X 章状态结算（State Settlement）

- 本章实际发生：

- 信息变化（Information Change）：

- 关系变化（Relationship Change）：

- 物理变化（Physical Change）：

- 权力变化（Power Change）：

- 伏笔变化（Hook Changes）：

- 人物变化（Character Changes）：

- 需要更新的文件：

- 下一章焦点（Next Focus）：
```

门禁：

- 没有状态结算（State Settlement）不进入下一章。
- 如果审稿失败，不写结算，先回到修订（Revise）。

## 11. 阶段七：交接恢复（Handoff / Resume）

长篇写作一定会中断，所以恢复路径必须短。

中断前写：

```text
handoffs/<date>-session.md
```

交接文件包含：

- 当前写到第几章。
- 最近完成了什么。
- 下一章要写什么。
- 当前焦点是什么。
- 哪些伏笔拖欠。
- 哪些人物或设定刚发生变化。
- 恢复时先读哪些文件。

恢复时默认读取：

```text
index.md
intent/current-focus.md
chapters/index.md
hooks/index.md
handoffs/index.md
最新 handoff
```

只有需要深度追溯时，再读具体人物、世界观、研究资料或旧章节。

## 12. 风格学习与规律提取（Style Learning / Pattern Extraction）

风格学习（Style Learning）输入：

- 参考小说片段（Style Samples）
- 用户喜欢的段落
- 用户不喜欢的段落
- 目标题材样例

输出：

```text
style/reference-analysis.md
style/style-guide.md
style/forbidden-patterns.md
```

`style/reference-analysis.md` 应提取：

- 句式长度
- 段落节奏
- 意象偏好
- 对话风格
- 视角控制
- 情绪推进方式
- 章节开头方式
- 章节结尾钩子
- 禁用模式

规律提取（Pattern Extraction）可以从参考小说中提取：

- 结构公式
- 人物关系模式
- 章节钩子类型
- 爽点组织方式
- 信息隐藏方式
- 反转方式

规则：

- 只提取规律，不复制原句。
- 产物进入 `style/`、`outline/` 或 `bible/`。
- 不把参考作品原文混入正文草稿。
- 如果参考文本受版权保护，只做短摘录和高层分析，不做大段复制。

## 13. 未来 skill 化附录（Skillization Appendix）

建议 skill 名称：

```text
novel-writing-workflow
```

触发条件（Triggers）：

- “帮我写小说”
- “我要长期写一本小说”
- “帮我设计世界观”
- “帮我做人设”
- “继续上一章”
- “检查这章有没有崩人设”
- “学习这段小说的风格”
- “提取这个题材的套路”

输入（Inputs）：

- 原始想法（Initial Idea）
- 参考作品（Reference Works）
- 风格样例（Style Samples）
- 已有章节（Existing Chapters）
- 用户禁区（Constraints）

输出（Outputs）：

- 小说项目目录（Novel Project Workspace）
- 作者意图（Author Intent）
- 当前焦点（Current Focus）
- 故事圣经（Story Bible）
- 人物档案（Character Bible）
- 世界观资料库（Worldbuilding Repository）
- 伏笔账本（Hook Ledger）
- 章节草稿、审稿、修订和结算文件

工作区（Workspace）：

- 使用 `novels/<book-slug>/`。
- 每个目录都有 `index.md`。
- 每次写作只读取恢复热路径（Resume Hot Path）和本章相关分文档。

阶段门禁（Gates）：

- 没有作者意图（Author Intent）不进入大纲。
- 没有人物基本档案（Character Bible）不写正文。
- 没有章节意图（Chapter Intent）不生成章节。
- 没有审稿（Audit）不声明章节完成。
- 没有状态结算（State Settlement）不进入下一章。

子流程（Subflows）：

- `init-novel`：初始化小说项目。
- `align-novel`：对齐作者意图。
- `plan-novel`：写总纲、卷纲和章节计划。
- `build-truth-source`：建立故事圣经、人物、世界观、关系、伏笔。
- `write-chapter`：执行单章流水线。
- `audit-chapter`：审稿。
- `revise-chapter`：修订。
- `settle-chapter`：状态结算。
- `learn-style`：风格学习。
- `handoff-novel`：交接恢复。

## 14. 快速执行清单（Quick Checklist）

从 0 开始写一本小说时：

- [ ] 写下原始想法，保存到 `origin/`。
- [ ] 确认作者意图（Author Intent）。
- [ ] 建立项目目录和各目录 `index.md`。
- [ ] 写故事核心，保存到 `bible/premise.md`。
- [ ] 写禁区，保存到 `bible/constraints.md`。
- [ ] 写主要人物，保存到 `characters/`。
- [ ] 写世界观硬规则，保存到 `worldbuilding/`。
- [ ] 写总纲和第一卷纲，保存到 `outline/`。
- [ ] 写伏笔账本初版，保存到 `hooks/`。
- [ ] 写第一章章节意图，保存到 `chapters/chapter-001/intent.md`。
- [ ] 组装第一章上下文包，保存到 `chapters/chapter-001/context.md`。
- [ ] 写初稿，保存到 `chapters/chapter-001/draft.md`。
- [ ] 审稿，保存到 `chapters/chapter-001/audit.md`。
- [ ] 修订，保存到 `chapters/chapter-001/revision.md`。
- [ ] 状态结算，保存到 `chapters/chapter-001/settlement.md`。
- [ ] 更新 `intent/current-focus.md`。

如果优先试用 InkOS：

- [ ] 安装 `@actalk/inkos`。
- [ ] 初始化一个测试项目。
- [ ] 配置模型服务。
- [ ] 用小型创意 brief 建书。
- [ ] 生成 1-3 章。
- [ ] 查看审稿和修订结果。
- [ ] 导出或查看项目文件。
- [ ] 判断是否继续使用 InkOS 作为主工具。
