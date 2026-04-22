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
- 影响：当前已将三件套迁回 `.devflow/devflow-skill-prompt-4-22-optimization/spec/`，并同步修正文档中的默认路径说明
