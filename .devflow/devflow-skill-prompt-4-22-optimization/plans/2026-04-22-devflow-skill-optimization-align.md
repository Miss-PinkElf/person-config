# DevFlow 技能（DevFlow Skill）流程级优化 Align 文档

## 1. 背景与问题来源

本次优化围绕 `zzz-prompt-debug/devflow优化/prompt-4-22.md` 展开。该文档基于真实使用过程中的踩坑记录，指出当前 `devflow` 技能（skill）虽然已经定义了对齐（Align）、计划（Plan）、规格（Spec）、实施（Apply）、验证（Verify）等流程规则，但在实际执行中仍暴露出以下结构性问题：

1. 硬门禁（Hard Gate）是文字声明，不是可执行检查
2. 轻量计划（Light Plan）缺少最小模板，导致小改动被跳过
3. 已有 mission 不会自动关联，恢复后的小改动容易脱离流程
4. 计划（Plan）与规格（Spec）边界不清，重型路径（Heavy Route）容易跳过 Propose / Tasks
5. checkpoint 机制缺少明确触发矩阵（Trigger Matrix）
6. description 触发词偏显式，隐式触发（Implicit Trigger）覆盖不足

这些问题不是单点文案问题，而是顶层工作流（workflow）规则、参考说明（references）与实际执行锚点之间的断层。

## 2. 本轮目标

本轮 mission 的目标是对 `devflow` 技能（DevFlow skill）做一次流程级优化，修正“有规则但难执行”的问题，使其在真实开发场景中更稳定地触发、记录和约束阶段切换。

本轮目标不追求建立完整评测（Evaluation）闭环，而是优先把顶层规则收口正确。

## 3. 范围

### 3.1 纳入范围

本轮正式范围包含以下 6 个优化项：

1. 门禁可执行化（Executable Gates）
2. 轻量计划最小模板（Light Plan Minimum Template）
3. 已有 mission 自动关联（Mission Auto-Attach）
4. 计划与规格分层澄清（Plan vs Spec Separation）
5. checkpoint 触发矩阵（Checkpoint Trigger Matrix）
6. 隐式触发扩展（Implicit Trigger Expansion）

### 3.2 不纳入范围

本轮不做以下事项：

1. 不新增评测（Evaluation）资产
2. 不新增 evals / benchmark / viewer 相关文件
3. 不修改 `superpowers-brainstorming`、`superpowers-writing-plans`、`openspec-*` 等子 skill 正文
4. 不扩展到 `.explore/` 或其他工作流体系

## 4. 方案比较

### 方案 A：最小补丁式优化

只修改 `.codex/skills/devflow/SKILL.md`，把 6 个优化项都直接塞入主文档。

优点：

- 改动集中
- 落地最快

缺点：

- 主文档会继续膨胀
- 规则、说明、模板混在一起，后续维护容易漂移

### 方案 B：主文档收口 + references 分层补齐

主文档保留主入口、路径、阶段与硬门禁摘要；细节下沉到 references。

优点：

- 结构清晰
- 主 skill 与 references 的职责更稳定
- 更适合后续继续演进

缺点：

- 需要处理好主文档和 references 的引用关系

### 方案 C：体系化优化 + 评测闭环

在方案 B 基础上，再补齐评测（Evaluation）资产与测试样例。

优点：

- 长期看更完整

缺点：

- 本轮复杂度明显上升
- 会把当前 mission 拉向“规则优化 + 评测体系建设”双目标

## 5. 本轮采用方案

本轮采用 **方案 B：主文档收口 + references 分层补齐**。

原因：

1. 当前最主要的问题不是“缺少更多文字”，而是规则没有被组织成可执行结构
2. 只改主文档会继续让 `SKILL.md` 臃肿
3. 当前优先级是先把顶层工作流（workflow）修正到位，而不是同步建设评测（Evaluation）体系

## 6. 文件边界设计

### 6.1 `.codex/skills/devflow/SKILL.md`

职责：

- 保留 `devflow` 主入口定位
- 维护路径分类（Route Classification）、阶段主线（Stage Flow）与硬门禁（Hard Gates）
- 增补高层摘要，而不是承载全部模板与长解释

本轮预计补充：

- 已有 mission 自动关联（Mission Auto-Attach）摘要
- 进入实施（Apply）前必须执行检查的摘要
- 计划（Plan）与规格（Spec）职责边界摘要
- 隐式触发（Implicit Trigger）摘要

### 6.2 `.codex/skills/devflow/references/routing-and-stages.md`

职责：

- 定义阶段流转（Stage Flow）
- 定义阶段前置检查（Preflight Checks）
- 定义路径升级 / 降级后的回写要求

本轮预计补充：

- `Plan -> Propose / Tasks -> Apply` 的检查链
- 重型路径（Heavy Route）进入 Apply 前必须确认 `proposal.md`、`design.md`、`tasks.md`
- 轻量路径（Light Route）进入 Apply 前的最小任务要求
- mission 自动关联后的路径归属说明

### 6.3 `.codex/skills/devflow/references/recording-rules.md`

职责：

- 定义记录规则（Recording Rules）
- 明确状态（state）、决策（decision）、checkpoint、handoff 的职责边界

本轮预计补充：

- checkpoint 触发矩阵（Checkpoint Trigger Matrix）
- checkpoint 与 handoff 的边界表达
- 每轮推进后的最小更新要求强化
- 恢复时的读取顺序强化

### 6.4 `.codex/skills/devflow/references/workspace-and-templates.md`

职责：

- 定义工作区（Workspace）结构
- 定义最小模板（Minimum Templates）

本轮预计补充：

- 轻量计划最小模板（Light Plan Minimum Template）
- mission 已存在时“刷新骨架而不是重建”的说明
- 必要时补充进入 Apply 的最小检查示例

### 6.5 `.devflow/devflow-skill-prompt-4-22-optimization/`

职责：

- 作为本轮 mission 的真相源（Source of Truth）
- 存放 Align、Plan、Spec、checkpoint、验证结果

这里不承载正式 skill 规则，只承载本轮过程记录与决策依据。

## 7. 六项优化的落点映射

### 7.1 门禁可执行化（Executable Gates）

落点：

- `SKILL.md`
- `references/routing-and-stages.md`

设计：

- 把“不可跳过的铁律”从原则表达升级为“进入下一阶段前必须执行的检查”
- 明确如果前置条件缺失，动作应是“回退并补齐”，而不是继续实施

### 7.2 轻量计划最小模板（Light Plan Minimum Template）

落点：

- `references/workspace-and-templates.md`
- `SKILL.md` 只保留摘要

设计：

- 补一个足以覆盖小改动的最小计划模板
- 强化规则：只要任务已进入某个 mission，相关小改动也不能跳过计划（Plan）

### 7.3 已有 mission 自动关联（Mission Auto-Attach）

落点：

- `SKILL.md`
- `references/routing-and-stages.md`

设计：

- 当 `.devflow/<mission>/` 文件、`NEXT-SESSION-PROMPT`、checkpoint、handoff 等已成为当前上下文的一部分时，默认认为该 mission 已激活
- 后续相关改动应继续纳入该 mission，而不是按“普通即时任务”处理

### 7.4 计划与规格分层澄清（Plan vs Spec Separation）

落点：

- `SKILL.md`
- `references/routing-and-stages.md`

设计：

- 计划（Plan）回答“做什么、顺序如何安排”
- 规格（Spec）回答“为什么这样做、技术上如何实现、任务如何追踪”
- 重型路径（Heavy Route）不能只靠 plan 直接进入 Apply

### 7.5 checkpoint 触发矩阵（Checkpoint Trigger Matrix）

落点：

- `references/recording-rules.md`
- `SKILL.md` 保留摘要

设计：

- 把 checkpoint 的触发时机写成明确列表
- 让 checkpoint 回答“做到哪了”，handoff 回答“下次怎么接”

### 7.6 隐式触发扩展（Implicit Trigger Expansion）

落点：

- `SKILL.md`
- `references/routing-and-stages.md`

设计：

- 把当前以显式触发词为主的 description，扩展成“显式触发 + 上下文触发”
- 让恢复场景、续作场景、mission 内小改动场景更容易自动进入 `devflow`

## 8. 验收标准

本轮 Align 通过后，后续 Plan / Apply 阶段至少应满足以下验收标准：

1. `SKILL.md` 中明确体现 mission 自动关联、隐式触发与门禁检查摘要
2. `routing-and-stages.md` 中明确体现阶段前置检查链
3. `recording-rules.md` 中明确体现 checkpoint 触发矩阵与 handoff 边界
4. `workspace-and-templates.md` 中提供可直接复用的轻量计划最小模板
5. 所有改动后的规则之间不互相冲突，不出现“主文档写一套、reference 写一套”的情况

## 9. 风险与约束

1. 如果主文档摘要写得过轻，可能导致只读 `SKILL.md` 时无法感知新门禁
2. 如果 reference 写得过重，可能重新造成维护成本上升
3. 本轮不改子 skill，因此只能通过顶层 `devflow` 规则约束子阶段衔接，不能指望子 skill 内部自动帮我们兜底

## 10. 下一步

1. 进入 Plan 阶段
2. 将本次 Align 结论落成正式实施计划（Implementation Plan）
3. 计划获批后，再进入 `SKILL.md` 与 references 的实际修改
