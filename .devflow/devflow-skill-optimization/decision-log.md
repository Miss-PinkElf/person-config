# 决策日志（Decision Log）

## 2026-04-22

### 决策 1：本次任务按重型路径（Heavy Route）推进

- 背景：用户明确要求“完整流程”“大需求”“使用 devflow 记录”
- 原因：本次优化涉及阶段门禁、触发策略、记录规则、评测闭环，不适合轻量路径
- 影响：后续必须经过 Align -> Plan -> proposal/design/tasks -> Apply -> Verify -> Close

### 决策 2：以 `prompt-4-22.md` 作为本轮优化的初始问题真相源

- 背景：用户明确指定该文档作为优化依据
- 原因：文档已经沉淀了真实踩坑现象、根因与改进建议
- 影响：后续 Align 与 Plan 将围绕该文档展开，但以仓库现状和本次对齐结果为最终准

### 决策 3：本轮采用方案 B，不建设评测（Evaluation）资产

- 背景：在方案比较后，用户明确要求“先按照 B 来修改”
- 原因：当前优先目标是修正 `devflow` 技能（DevFlow skill）的流程规则与 reference 结构，而不是同步建立评测闭环
- 影响：本轮变更聚焦 `SKILL.md` 与 references；评测样例、evals 或 benchmark 资产不纳入正式范围

### 决策 4：Align 阶段采用“主文档收口、references 承担细则”的文件边界

- 背景：本轮需要同时补门禁、模板、记录规则与隐式触发，若全部堆入主文档将继续造成臃肿
- 原因：`SKILL.md` 更适合承载主入口、阶段门禁与摘要；references 更适合承载执行细则与模板
- 影响：后续实施将主要修改 `SKILL.md`、`references/routing-and-stages.md`、`references/recording-rules.md`、`references/workspace-and-templates.md`

### 决策 5：Plan 阶段先产出完整实施计划，再进入 proposal / design / tasks

- 背景：用户要求走完整 `devflow` 流程，且 AGENTS 明确要求先计划（Plan）再实施（Apply）
- 原因：需要先把修改范围、文件边界、验证方式、状态回写与 OpenSpec 三件套产出顺序写清楚
- 影响：当前先审核 Plan 文档；批准后再产出 proposal / design / tasks，并进入正式 Apply

### 决策 6：OpenSpec 三件套继续沿用方案 B 的收口边界

- 背景：进入 proposal / design / tasks 阶段后，需要把 Align 与 Plan 的边界正式固化到 artifact
- 原因：如果 artifact 与前序结论不一致，后续 Apply 容易再次发生范围漂移
- 影响：proposal、design、tasks 均明确限定为“只改 `SKILL.md` + 3 个 references + mission 记录”，不纳入评测（Evaluation）或子 skill 修改

### 决策 7：Apply 阶段采用顺序模式，集中修改 4 份正式文档

- 背景：本轮任务全部围绕 `devflow` 顶层 skill 与 references，文件之间存在强耦合
- 原因：顺序模式更适合控制术语一致性，避免并行修改造成主文档与 references 表述分裂
- 影响：本轮按 `SKILL.md` -> `routing-and-stages.md` -> `recording-rules.md` -> `workspace-and-templates.md` 的顺序收口

### 决策 8：本轮以文档验证证据作为完成门禁

- 背景：本轮变更属于技能文档与流程规则更新，不存在编译或单元测试入口
- 原因：最有价值的验证证据是关键词落点搜索与正式 diff 检查，而不是伪造运行时测试
- 影响：本轮使用 `rg` 关键词搜索和 `git diff --check` 作为新鲜验证证据，并据此进入 Close

### 决策 9：当前对话以 handoff 方式暂停，不自动提交代码

- 背景：用户发起对话收尾流程，需要为下次恢复准备上下文
- 原因：当前变更已完成且已验证，但用户尚未明确要求 `commit`
- 影响：本轮通过 handoff、checkpoint 与 `NEXT-SESSION-PROMPT` 收束；下次恢复时先确认是否需要提交代码

### 决策 10：devflow 内的 spec 三件套以 mission 本地 `spec/` 为真相源

- 背景：本轮执行过程中，曾误将 `proposal.md`、`design.md`、`tasks.md` 写到 `openspec/changes/`
- 原因：主 skill 与 `openspec-propose` 子 skill 对 artifact 路径的契约不够硬，导致执行时滑到了全局路径
- 影响：当前已将三件套迁回 mission 本地 `spec/`，并同步修正文档中的默认路径说明

## 2026-05-01

### 决策 11：将 mission 命名从单次 prompt 绑定调整为长期主题

- 背景：用户指出当前 mission 名称带有日期和 prompt 编号，不适合作为长期 `devflow` 技能（DevFlow skill）优化工作区
- 原因：该 mission 的真实目标是持续优化 `devflow` 技能，而不是只处理 `prompt-4-22` 这一轮输入
- 影响：mission 目录调整为 `.devflow/devflow-skill-optimization/`，恢复入口与当前状态同步使用新 slug

### 决策 12：新增总记录（overall record），但不放入默认恢复热路径

- 背景：用户希望有一个能理解项目或需求开发过程的总记录，同时担心恢复 token 消耗和文件无限增长
- 原因：人类理解需要完整脉络，agent 日常恢复需要短上下文；两者职责不同
- 影响：新增 `development-overview.md` 作为开发总览（development overview），日常恢复仍优先读取 `state.md` 与 `checkpoints.md`

### 决策 13：优化 `devflow` 技能本体，同时同步交接提示词

- 背景：用户追问“这个 skills 不需要优化吗”，并明确要求按照 `skill-creator-cc` 优化该 skill
- 原因：只改 `devflow-handoff.md` 只能改善收尾提示词，不能改变 `devflow` 技能（DevFlow skill）本体在恢复、记录和上下文预算上的默认行为
- 影响：本轮正式修改 `.codex/skills/devflow/SKILL.md`、`references/recording-rules.md`、`references/workspace-and-templates.md`，并同步更新 `devflow-handoff.md`

### 决策 14：恢复热路径默认只读 `state.md` 与 `checkpoints.md`

- 背景：用户同时担心恢复 token 消耗和记录文件无限增长
- 原因：长期 mission 需要把“恢复当前工作”和“理解完整过程”拆成两条路径
- 影响：`state.md` 与 `checkpoints.md` 成为默认恢复热路径（Resume Hot Path）；`development-overview.md`、`decision-log.md`、`plans/`、`spec/`、`handoffs/` 作为深度追溯路径（Deep Trace Path）按需读取

### 决策 15：暂不将 handoff 拆成多模式

- 背景：用户反馈 `devflow-handoff.md` 普通收尾可能耗时约 20 分钟
- 原因：曾讨论快速收尾、上下文压缩交接与深度交接等多模式，但用户明确要求 `devflow-handoff.md` 暂时不优化，保持原本流程
- 影响：已撤回 `devflow-handoff.md` 与内置 `session-handoff` 子技能的分模式改动；耗时问题保留在 `bug-log.md`，后续如继续处理需重新对齐方案
