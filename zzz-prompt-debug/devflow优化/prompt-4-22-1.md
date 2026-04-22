# DevFlow 优化报告

> 评审日期：2026-04-20
> 评审版本：0.2.0
> 对比基线：devflow-v1 (0.1.0)

## 整体评分

| 维度          | 评分 (1-10) | 说明                                                           |
| ------------- | :---------: | -------------------------------------------------------------- |
| 流程完整性    |    **9**    | 从 Classify 到 Close 的全链路覆盖，含探索、恢复、bug 路径      |
| 职责分层      |    **9**    | 外层调度 + OpenSpec 阶段 + Superpowers 质量，三层清晰          |
| 门禁设计      |    **8**    | 8 类门禁覆盖全面，但部分门禁在主 SKILL.md 和 references 中重复 |
| 子 skill 深度 |    **8**    | 核心子 skill 从摘要版变成方法论级别，质量飞跃                  |
| 可维护性      |    **6**    | 内容分散在多层文件中，修改一个规则可能需要同步 3-4 处          |
| 上下文效率    |    **6**    | 全量加载时 token 消耗大，按需加载依赖 AI 的判断准确性          |

**总分：7.5 / 10** — 核心设计优秀，工程化收尾还差一步。

---

## 优势（做得好的地方）

### 1. 「铁律」机制设计精准

V2 最核心的改进是把关键规则从「建议」升级为「硬门禁」：

```
用户说"直接做""先写 plan""先出 tasks"都不构成跳过对齐的许可
```

解决了 V1 最大的实际问题——AI 容易被用户的「先做吧」带偏，跳过关键步骤。V2 用明确的禁止语义堵住了这个口子。

### 2. Mission Init 的引入

强制在正式工作前建立 `workflow.md` + `state.md` + `decision-log.md` 骨架，确保后续所有记录有落脚点。避免了 V1 中「做了一半才发现没建工作区」的窘境。

### 3. 子 skill 从摘要变成完整方法论

| 子 skill             | V1 行数 | V2 行数 | 质量变化                                                       |
| -------------------- | :-----: | :-----: | -------------------------------------------------------------- |
| brainstorming        |   32    |   164   | 从提纲变成含流程图、visual companion、自检清单的完整技能       |
| systematic-debugging |   31    |   297   | 从口号变成四阶段科学方法 + 支撑技术文档                        |
| subagent-driven-dev  |   31    |   278   | 从概念变成含 Prompt 模板、Model 选择策略、状态处理的工程化方案 |
| TDD                  |   ~30   |   370   | 从要求变成含 Red-Green-Refactor 全流程 + 反模式库              |
| verification         |   ~20   |   140   | 从"要验证"变成具体的 Gate Function + 常见失败表                |

### 4. 纯探索分支

`Explore` 作为独立分支解决了「讨论还是实现」的模糊地带：

- Explore 不是 Align，不需要收敛
- Explore 不是 Apply，不能偷跑实现
- 退出条件清晰：足够进入 Align 时退出

### 5. checkpoint 与 handoff 关系厘清

- checkpoint = 阶段内沉淀，更频繁
- handoff = 跨会话交接，更重
- resume 时先读 checkpoint，handoff 只是补充

### 6. `superpowers-writing-plans` 新增

填补了 V1 中 Align → Propose 之间缺少「把讨论结论变成可执行计划」桥梁的空缺。含文件结构规划、Bite-Sized 任务粒度指南、No Placeholders 清单、自检机制、执行交接选择。

---

## 问题清单

### P1: 规则重复，维护风险高

**严重度：中高**

同一条规则在多处出现。以「没有 plan 不进入 Apply」为例，出现在以下 6 处：

| 位置        | 文件                                    |
| ----------- | --------------------------------------- |
| 铁律第 3 条 | `SKILL.md`                              |
| 计划门禁    | `SKILL.md` → 阶段门禁                   |
| 计划门禁    | `references/quality-gates.md`           |
| 禁令        | `references/brainstorming-guide.md`     |
| 进入条件    | `skills/openspec-propose/SKILL.md`      |
| 约束        | `skills/openspec-apply-change/SKILL.md` |

改一处漏其他处，迟早出现矛盾。

**建议**：采用「定义一次 + 引用多次」模式。主 SKILL.md 作为铁律唯一定义点，子 skill 和 references 只引用不复述：

```markdown
<!-- 子 skill 中 -->

> 前置条件：见主 SKILL.md「不可跳过的铁律」第 3 条
```

---

### P2: 上下文预算不透明

**严重度：中**

全量加载主 SKILL.md（328 行）+ 被触发子 skill（100-370 行）+ 对应 references，一次 brainstorming 流程可能吃掉 800-1200 行的 skill 上下文。

但 SKILL.md 中没有任何上下文预算的指导。AI 不知道：

- 什么时候该只读主 SKILL.md 而不深入子 skill
- 什么时候该读 references 而不是靠主 SKILL.md 的摘要
- 轻量路径是否可以跳过大部分子 skill 的加载

**建议**：在主 SKILL.md 的「读取地图」中加入加载策略：

```markdown
## 加载策略

- 轻量路径：只读主 SKILL.md + 被触发子 skill，不读 references
- 重型路径：主 SKILL.md + 子 skill + 按需 references
- bug 路径：主 SKILL.md + debugging skill（含附属文档）
- resume 路径：主 SKILL.md + state.md + checkpoint + handoff
```

---

### P3: 子 skill 语言风格不统一

**严重度：低中**

- 主 SKILL.md、OpenSpec 系列、references → **全中文**
- Superpowers 系列（brainstorming, debugging, TDD, verification, subagent-dev, writing-plans）→ **全英文**

在一个标注为中文的 skill 包中混入大量英文内容，对中文用户不够友好，也与 CLAUDE.md 中「优先使用中文」的要求冲突。

**建议**：

- 方案 A（推荐）：将核心 Superpowers 子 skill 汉化
- 方案 B：保留英文正文，但统一 description 和章节标题为中文

---

### P4: visual companion 缺少运行时依赖

**严重度：低**

`skills/superpowers-brainstorming/visual-companion.md` 引用了：

- `scripts/start-server.sh`
- `scripts/frame-template.html`
- `scripts/helper.js`
- `scripts/stop-server.sh`

但 V2 的 `skills/superpowers-brainstorming/` 目录中没有 `scripts/` 文件夹。如果 AI 尝试启动 visual companion，会直接失败。

**建议**：

- 方案 A：补齐 scripts 目录
- 方案 B：在 brainstorming SKILL.md 中加入前置检查，scripts 不存在时自动退回纯文本模式

---

### P5: 缺少「快速逃生」/ Override 机制

**严重度：低中**

V2 的门禁体系非常严格，但没有「用户强制跳过」的合法通道。如果用户确实在赶工期且明确知道风险，目前唯一的出路是违反铁律——这让 AI 陷入两难。

**建议**：加入 Override 机制：

```markdown
## Override 规则

用户可以显式声明"我知道风险，跳过 X 门禁"。

此时：

1. 记录到 decision-log.md，标注为 Override
2. 记录被跳过的门禁名称和用户给出的理由
3. 继续执行后续流程

Override 不能由 AI 主动建议，只能由用户主动发起。
```

---

### P6: 缺少发布/安装配置

**严重度：取决于分发需求**

V2 没有以下文件：

- `.claude-skill.json` — skill 元信息
- `package.json` — tnpm 包配置
- `node_modules/` — 安装器依赖

无法通过 `tnpm install @antskill/devflow` 安装到其他项目。

**建议**：从 V1 回移打包配置，更新版本号为 0.2.0：

```bash
cp skills/devflow-v1/.claude-skill.json skills/devflow-v2/
# 更新 package.json 中 version 为 0.2.0, description 与 V2 对齐
```

---

## 与 V1 对比总结

| 维度              | V1                 | V2                       |   赢家   |
| ----------------- | ------------------ | ------------------------ | :------: |
| 流程完整性        | 基础框架           | 全链路 + 铁律 + 探索分支 |    V2    |
| 子 skill 实战价值 | 口号级，执行无指导 | 方法论级，可按步骤执行   |    V2    |
| 分发就绪          | tnpm 包，可安装    | 纯目录，需补打包         |    V1    |
| 上下文效率        | 轻量但内容不足     | 内容充足但可能过重       | 各有取舍 |
| 语言一致性        | 中英混合但量少     | 中英混合且量大           | 都需改进 |
| 可维护性          | 内容少，维护简单   | 规则重复多，维护有风险   |    V1    |

## 推荐行动优先级

1. **P1 规则去重** — 影响大，改动集中，收益明确
2. **P2 加载策略** — 直接影响实际使用时的 token 效率
3. **P6 发布配置** — 如果需要跨项目分发，这是前置条件
4. **P5 Override 机制** — 提升实际工作中的灵活性
5. **P3 语言统一** — 体验优化，工作量较大
6. **P4 visual companion** — 低优先，用到再补