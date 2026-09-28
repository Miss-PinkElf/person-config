# 快捷打开指定文件

一个独立的 VS Code 插件（VS Code Extension）。它注册一个命令（Command），由你在 `keybindings.json` 里绑定任意多条快捷键（Keybinding）。每条快捷键打开一个指定文件，并把光标放到真正的文件末尾，或最后一个非空白字符之后。

插件不预设快捷键，也不会创建不存在的文件。

## 配置

打开命令面板，执行 `Preferences: Open Keyboard Shortcuts (JSON)`。下面的按键只是示例，请换成自己不冲突的组合。

macOS：

```json
[
  {
    "key": "cmd+alt+1",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "notes/today.md", "cursor": "end" }
  },
  {
    "key": "cmd+alt+2",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "/Users/example/notes/inbox.md", "cursor": "lastContent" }
  }
]
```

Windows：

```json
[
  {
    "key": "ctrl+alt+1",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "notes/today.md", "cursor": "end" }
  },
  {
    "key": "ctrl+alt+2",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "C:/Users/example/notes/inbox.md", "cursor": "lastContent" }
  }
]
```

Linux：

```json
[
  {
    "key": "ctrl+alt+1",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "notes/today.md", "cursor": "end" }
  },
  {
    "key": "ctrl+alt+2",
    "command": "quickOpenTarget.openFile",
    "args": { "path": "/home/example/notes/inbox.md", "cursor": "lastContent" }
  }
]
```

## 参数

| 字段 | 是否必填 | 含义 |
| --- | --- | --- |
| `path` | 必填 | 本机绝对路径，或当前工作区相对路径 |
| `cursor` | 可选 | `end` 或 `lastContent`，默认 `end` |
| `workspaceFolder` | 多根工作区的相对路径必填 | 工作区文件夹名称，必须唯一 |

`cursor: "end"` 停在真正的文件末尾。文件以换行结尾时，光标会落在结尾空行，方便直接追加内容。

`cursor: "lastContent"` 停在最后一个非空白字符之后，结尾的空格、制表符和换行会被跳过。空文件或全空白文件停在文档起点。

## 路径规则

- 绝对路径不依赖当前工作区。不要同时填写 `workspaceFolder`。
- 单根工作区的相对路径相对该根目录解析。
- 多根工作区必须写 `workspaceFolder`。名称缺失、不存在或重复时会报错，不会猜测。
- 相对路径不能用 `..` 越出工作区。工作区外的文件请写绝对路径。
- 没有打开工作区时，相对路径会报错。
- 不展开 `~`、环境变量或 VS Code 变量，也不接受 `file://` 这类 URI。
- 第一版只解析本机文件夹工作区。远程工作区里的相对路径会报错。

## 错误处理

参数无效、路径不明确、文件不存在、目标是目录或文件无法打开时，会显示错误消息。插件不会创建目标文件，也不会修改文件内容。

命令 ID 是 `quickOpenTarget.openFile`。从命令面板直接运行时没有 `args`，因此会提示缺少 `path`。请通过快捷键规则调用它。

## 开发验证

```bash
npm install
npm run compile
npm test
npm run package
```

`npm test` 应输出 `cursor position tests passed` 和 `open target tests passed`。`npm run package` 生成 `vscode-quick-open-target-0.1.0.vsix`。

安装 VSIX 后的手动验证：

1. 配置两条快捷键，分别打开两个已存在的文件，并分别使用 `end` 和 `lastContent`。
2. 确认编辑器切到前台，光标位置符合模式，文件内容不变。
3. 把其中一条路径改成不存在的文件，确认只出现错误提示。
