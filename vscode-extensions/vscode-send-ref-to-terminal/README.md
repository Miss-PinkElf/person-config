# Send Ref to Terminal

一个极简 VS Code 插件（VS Code Extension），用于把当前选中的代码行引用发送到当前活动终端（Active Terminal）输入区，并且不自动执行。

## 使用方式

1. 在编辑器中打开文件。
2. 选中一行或多行代码。
3. 确认目标终端是当前活动终端。
4. 按默认快捷键：
   - macOS：`Cmd+Shift+L`
   - Windows/Linux：`Ctrl+Shift+L`

终端输入区会出现类似内容：

```text
@src/example.ts#L12-20 
```

## 限制

- 不自动识别 Claude Code 终端。
- 不自动执行终端输入。
- 不支持多选区。
- 不实现终端自动重命名（Terminal Rename）。

## 命令

- `Send File Reference to Terminal`
- 命令 ID（Command ID）：`sendRefToTerminal.send`

## 开发验证

```bash
npm install
npm run compile
npm test
npm run package
```
