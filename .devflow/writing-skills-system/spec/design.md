# Design

## 总体思路

`conversation-to-knowledge-doc` 采用一个主入口和四个模式参考文件。主入口 `SKILL.md` 只保留触发条件、信息边界、固定流程和路由规则；具体写作结构放在 `references/` 中，以避免主文件过长。

## 结构与边界

```text
conversation-to-knowledge-doc/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── review-knowledge-doc.md
    ├── tutorial-article.md
    ├── project-knowledge-note.md
    └── adaptive-structure.md
```

- `SKILL.md`：触发、流程、边界、输出路径、命名规则和参考文件路由。
- `agents/openai.yaml`：Codex UI 元数据（metadata），便于展示和默认调用。
- `references/review-knowledge-doc.md`：复盘型知识文档规则。
- `references/tutorial-article.md`：教程型文章规则。
- `references/project-knowledge-note.md`：项目沉淀文档规则。
- `references/adaptive-structure.md`：自适应结构选择规则。

## 数据流与接口

1. 用户请求总结当前对话或整理为知识文档。
2. 技能触发后检查是否已指定输出模式（output mode）。
3. 如果未指定，先询问用户选择模式。
4. 读取对应参考文件（reference file）。
5. 基于当前对话和明确引用文件生成大纲（outline）。
6. 用户确认大纲后写入 `zzz-docs/主题-类型-日期.md`。
7. 返回相对路径和关键摘要。

## 复用点

- 复用系统技能创建器（skill-creator）的 `init_skill.py` 初始化目录。
- 复用 `quick_validate.py` 验证 YAML frontmatter 和技能命名。
- 参考公开技能中的渐进披露（progressive disclosure）思路，把模式细节拆到 `references/`。

## 风险与权衡

- 选择参考文件会增加文件数量，但能让四种模式规则更清晰。
- 不默认读取历史文档会降低自动化程度，但能避免背景污染。
- 写入前大纲确认会增加一次交互，但能降低写错结构或延伸方向的概率。
- 同时维护两份技能会增加同步成本，因此必须把 `skills/all-skills/...` 作为真相源，并用 `diff -qr` 验证一致性。
