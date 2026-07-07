# 下一次对话提示词：novel-writing-prompt-debug

请继续 devflow mission：`novel-writing-prompt-debug`。

## 恢复读取顺序

1. 先读 `.devflow/novel-writing-prompt-debug/state.md`
2. 再读 `.devflow/novel-writing-prompt-debug/checkpoints.md`
3. 如需完整恢复，读 `.devflow/novel-writing-prompt-debug/handoffs/index.md`
4. 再读最新 handoff：`.devflow/novel-writing-prompt-debug/handoffs/2026-07-07-001-novel-writing-workflow-handoff.md`
5. 如需理解完整过程，再读 `.devflow/novel-writing-prompt-debug/development-overview.md`
6. 如需处理延期项，再读 `.devflow/novel-writing-prompt-debug/backlog.md` 和 `.devflow/novel-writing-prompt-debug/deferred/2026-07-07-future-novel-workflow-work.md`

## 当前进度概述

已完成 AI 小说写作调研报告（AI Novel Writing Research Report）和 AI 小说写作工作流（AI Novel Writing Workflow）：

- `zzz-prompt-debug/写小说/AI小说写作调研报告.md`
- `zzz-prompt-debug/写小说/AI小说写作工作流.md`

核心结论：

- InkOS 可作为第一优先试用对象。
- 自建路线应采用目录化资料库（Folder-based Knowledge Base）：文件夹 + `index.md` + 分片文档。
- 后续如果创建 skill，应定位为小说项目管理技能（Novel Project Management Skill），不是单纯正文生成技能（Novel Text Generator Skill）。

## 未完成任务清单

- [ ] 用户审阅两份文档，确认是否需要调整详略。
- [ ] 决定是否先试用 InkOS。
- [ ] 如果试用 InkOS，写一份短计划：安装、配置模型、创建测试小说、生成 1-3 章、检查审稿与修订。
- [ ] 如果不试用 InkOS，创建自建目录化小说项目模板。
- [ ] 后续再决定是否创建 `novel-writing-workflow` skill。

## 未讨论完的议题

- 是否以中文网文（Web Novel）为优先题材补充专项方法。
- 是否需要风格学习（Style Learning）样例流程。
- 是否需要把工作流转换成可复用 skill。
- InkOS 的 AGPL-3.0-only 许可证边界：个人本地使用和二次开发/对外服务需区分。

## 建议下次优先处理

优先询问用户选择：

1. 直接试用 InkOS。
2. 基于 `AI小说写作工作流.md` 创建空白小说项目模板。

如果用户没有明确选择，建议先做 InkOS 本地试用，因为它能验证现成工具是否已经满足大部分需求。
