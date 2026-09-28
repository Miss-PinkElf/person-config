# Proposal

## 背景

用户希望用快捷键（Keybinding）快速打开固定文件，并把光标放到文件末尾。原始标题写的是定位文件夹，对齐时已确认本轮只打开文件。多个目标通过多条快捷键区分，而不是在插件里做图形化管理。

## 目标

构建独立插件 `vscode-quick-open-target`：

- 注册命令（Command）`quickOpenTarget.openFile`。
- 每条快捷键用 `args.path` 指定一个文件，用可选的 `args.cursor` 指定光标模式。
- 支持本机绝对路径（Absolute Path）和工作区相对路径（Workspace Relative Path）。
- 打开已存在的文件，把编辑器切到前台，并设置单一光标。
- 提供中文 README 和 VSIX。

## 范围

- 新建 `vscode-extensions/vscode-quick-open-target/`。
- 参数只来自快捷键 `args`：`path`、`cursor`、`workspaceFolder`。
- `cursor` 支持 `end` 与 `lastContent`，默认 `end`。
- 多根工作区（Multi-root Workspace）的相对路径必须给出唯一工作区名称。
- 纯函数测试覆盖路径解析和光标偏移。
- 编译、测试并打包 `vscode-quick-open-target-0.1.0.vsix`。

## 非目标

- 不定位文件夹。
- 不提供默认快捷键。
- 不提供图形化配置界面。
- 不自动创建不存在的文件。
- 不展开 `~`、环境变量、VS Code 变量，不接受 URI。
- 不打开远程工作区中的相对路径。
- 不修改现有插件，不与受控文件浏览器（Controlled Explorer）耦合。

## 边界场景

- 参数缺失、类型错误、未知字段、非法 `cursor`：显示中文错误。
- 绝对路径同时写了 `workspaceFolder`：显示参数错误。
- 没有工作区、多根工作区名称缺失、名称不存在或名称重复：不猜测目标。
- 相对路径用 `..` 越出工作区：拒绝，并提示改用绝对路径。
- 文件不存在或目标是目录：只提示错误。
- 空文件和全空白文件在 `lastContent` 下停在文档起点。
- 文件以换行结尾时，`end` 停在结尾空行。

## 开放问题

无阻塞开放问题。用户已授权计划完成后直接进入 Apply。
