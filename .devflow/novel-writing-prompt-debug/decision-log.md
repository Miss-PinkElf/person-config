# 决策日志（Decision Log）

## 2026-07-07：建立 devflow mission

- 决策：新建 `novel-writing-prompt-debug` mission。
- 原因：当前请求明确要求使用 devflow 记录，并且提示词内容可能演进为写作工作流、skill 设计或外部项目调研，适合保留过程记录。
- 影响：后续相关讨论、计划和实现优先纳入 `.devflow/novel-writing-prompt-debug/`。

## 2026-07-07：当前仅进入探索阶段

- 决策：本轮不进入实现（Apply），只进行提示词阅读和初步归纳。
- 原因：原始提示词提出多个方向，但尚未确认优先级与最终产出。
- 影响：后续必须先完成对齐（Align）和计划（Plan），再创建或修改具体 skill、文档或代码。

## 2026-07-07：小说资料库采用目录化索引结构

- 决策：小说工作区的主要真相源（Truth Source）不采用单个大 Markdown 文件，而采用“文件夹 + `index.md` + 分片文档”的结构。
- 原因：长篇小说体量可能很大，人物、设定、关系、章节、伏笔和修订记录会持续增长；单文件会导致上下文恢复、检索、局部更新和人工阅读都变困难。
- 影响：后续 AI 小说写作工作流文档（AI Novel Writing Workflow Document）需要以目录化资料库为核心设计，后续 skill 化时也要按目录索引读取，而不是默认全量注入。

## 2026-07-07：InkOS 作为第一优先试用对象

- 决策：后续若继续推进，优先评估直接试用 InkOS，而不是立即创建自研 skill。
- 原因：InkOS 已覆盖长篇小说（Long-form Novel）、章节流水线（Chapter Pipeline）、真相文件（Truth Files）、审稿修订（Audit / Revise）和上下文治理（Context Governance），能作为现成工具基准。
- 影响：下次会话建议优先选择“试用 InkOS”或“创建自建目录化模板”路线；若涉及二次开发或对外服务，需要先处理 AGPL-3.0-only 许可证边界。
