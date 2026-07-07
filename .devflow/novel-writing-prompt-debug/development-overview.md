# 写小说提示词调试总记录（Development Overview）

## 定位

本文件用于理解完整开发过程，不是默认恢复热路径。日常恢复优先读取 `state.md` 与 `checkpoints.md`。

## 背景

用户提供 `zzz-prompt-debug/写小说/prompt-1.md`，希望了解如何用 AI 写小说、是否有写作/风格提取 skills，以及是否可以参考 `https://github.com/Narcooo/inkos`。

## 已完成阶段

### 输入吸收（Input Intake）

- 读取原始提示词。
- 创建 devflow mission：`novel-writing-prompt-debug`。
- 建立 `workflow.md`、`state.md`、`origin.md`、`decision-log.md`。

### 对齐与调研（Align / Research）

- 确认第一阶段目标为 A + D：AI 小说写作工作流文档（AI Novel Writing Workflow Document）与调研报告（Research Report）。
- 确认文档目标为“个人可执行 SOP + 未来 skill 化接口”。
- 确认小说资料库采用目录化结构：文件夹 + `index.md` + 分片文档。
- 优先复查 InkOS：npm `@actalk/inkos` 当前 latest 为 `1.6.3`，许可证为 AGPL-3.0-only。

### 计划（Plan）

- 写入调研报告计划：`plans/2026-07-07-ai-novel-research-report-plan.md`。
- 写入工作流文档计划：`plans/2026-07-07-ai-novel-workflow-document-plan.md`。

### 正式撰写（Apply）

- 产出 `zzz-prompt-debug/写小说/AI小说写作调研报告.md`。
- 产出 `zzz-prompt-debug/写小说/AI小说写作工作流.md`。

## 关键决策

- InkOS 可作为第一优先试用对象，但不应完全替代用户自己的写作方法和资料库结构。
- 自建工作流必须采用目录化资料库（Folder-based Knowledge Base）。
- 后续如创建 skill，应定位为小说项目管理技能（Novel Project Management Skill），不是单纯正文生成技能（Novel Text Generator Skill）。

## 当前开放问题

- 是否要实际安装/试用 InkOS。
- 是否要基于工作流创建一个空白小说项目模板。
- 是否要继续创建 `novel-writing-workflow` skill。

## 推荐读取策略

- 日常恢复：读 `state.md`、`checkpoints.md`。
- 理解完整过程：读本文件。
- 执行后续计划：读 `plans/` 下对应计划。
