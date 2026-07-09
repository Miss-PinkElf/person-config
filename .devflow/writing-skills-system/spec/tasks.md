# Tasks

- [x] 任务 1：初始化真相源技能目录
  - 使用系统技能创建器（skill-creator）初始化 `skills/all-skills/conversation-to-knowledge-doc/`
  - 产物包括 `SKILL.md`、`agents/openai.yaml`、`references/`

- [x] 任务 2：编写主技能文件
  - 替换 `SKILL.md`
  - 写清触发条件、信息来源边界、输出模式路由、大纲确认、输出路径、命名规则

- [x] 任务 3：编写四个模式参考文件
  - `references/review-knowledge-doc.md`
  - `references/tutorial-article.md`
  - `references/project-knowledge-note.md`
  - `references/adaptive-structure.md`

- [x] 任务 4：生成同步副本
  - 从 `skills/all-skills/conversation-to-knowledge-doc/` 复制到 `.codex/skills/conversation-to-knowledge-doc/`

- [x] 任务 5：验证技能结构与同步一致性
  - 运行 `quick_validate.py` 验证真相源和同步副本
  - 使用 `diff -qr` 验证两份目录一致
  - 使用 `rg` 检查未完成标记

- [x] 任务 6：更新 devflow 记录
  - 更新 `state.md`
  - 更新 `checkpoints.md`
  - 必要时更新 `decision-log.md`

## 验证

- `python3 /Users/mobius/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/all-skills/conversation-to-knowledge-doc`
- `python3 /Users/mobius/.codex/skills/.system/skill-creator/scripts/quick_validate.py .codex/skills/conversation-to-knowledge-doc`
- `diff -qr skills/all-skills/conversation-to-knowledge-doc .codex/skills/conversation-to-knowledge-doc`
- `pattern='T[B]D|TO[D]O|FIX[M]E|待[定]|待[补]充'; rg -n "$pattern" skills/all-skills/conversation-to-knowledge-doc .codex/skills/conversation-to-knowledge-doc`
