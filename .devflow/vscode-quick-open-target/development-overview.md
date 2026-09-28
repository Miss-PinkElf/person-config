# vscode-quick-open-target 总记录（Development Overview）

## 需求怎么收敛

原始需求写的是“快捷键定位文件夹”，正文却要求打开文件并把光标放到末尾。对齐时用户确认本轮只打开文件，不定位文件夹。

随后确认了三件事：多条快捷键直接写在 `keybindings.json`；路径同时支持工作区相对路径和绝对路径；光标模式 `end` 与 `lastContent` 都要，由每条快捷键自己选择。

## 这一轮做了什么

- 对齐文档：`plans/2026-09-28-quick-open-file-align.md`
- 实施计划：`plans/2026-09-28-quick-open-file-plan.md`
- 规格：`spec/proposal.md`、`spec/design.md`、`spec/tasks.md`
- 插件：`vscode-extensions/vscode-quick-open-target/`
- 2026-09-28 的自动验证通过，VSIX 已生成。插件代码提交为 `57d3ba8`。
- VS Code 里的手动快捷键验证还没有做，留在 backlog。

## 第一版、延期和明确不做

- 明确不做：文件夹定位。用户已经说不需要，不再作为后续任务。
- 第一版限制：不展开 `~`、环境变量和 VS Code 变量，不接受 URI，不解析远程工作区相对路径，不自动创建缺失文件，不提供默认快捷键。
- 明确延期：图形化快捷键配置。细节在 `deferred/`。
