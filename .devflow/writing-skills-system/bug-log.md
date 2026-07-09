# 问题日志（Bug Log）

## 2026-07-09：技能初始化脚本部分成功后失败

- 问题现象：执行 `init_skill.py conversation-to-knowledge-doc --path skills/all-skills --resources references ...` 时，脚本创建了 `skills/all-skills/conversation-to-knowledge-doc/` 和 `SKILL.md`，但随后报错：`short_description must be 25-64 characters (got 14)`。
- 问题原因：传入的 `short_description` 为“把对话整理为可沉淀的知识文档”，脚本按字符长度校验后判定不足 25 个字符，导致 `agents/openai.yaml` 未生成，`references/` 也未完成创建。
- 解决方案：保留已创建的技能目录，使用 `generate_openai_yaml.py` 以更长的 `short_description` 重新生成 `agents/openai.yaml`，并手动补建 `references/` 目录后继续实施。最终使用的 `short_description` 为“把当前对话和引用文件整理为结构化知识文档和可复用文章素材”。
