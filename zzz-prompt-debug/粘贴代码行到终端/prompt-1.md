# 核心思路与需求整理：vscode-send-ref-to-terminal

## Metadata（元数据）

| 字段 | 内容 |
|------|------|
| 创建时间（Created At） | 2026-07-03 |
| 作者（Author） | ShuoWang |
| 目的（Purpose） | 回顾并整理 VSCode 扩展 `send-ref-to-terminal` 的开发全过程，记录核心思路、需求、技术决策与经验教训 |
| 关联仓库（Related Repository） | person-code-config |
| 关联 Mission（Related Mission） | vscode-send-ref-to-terminal（已 Close） |
| 关联文档 | `origin.md`、`plan-v1.md`、`decision-log.md`、`learnings.md`、`checkpoints.md`、`handoff-*.md` |
| 当前状态（Status） | 已完成（Completed） |
| 文档边界（Scope / Boundary） | 本文档是对已 Close mission 的回顾性整理，不触发新实现 |

---

## 一、原始需求与动机

### 1.1 痛点

使用 Claude Code 时，经常需要将当前打开的代码文件引用发送到 Claude Code 终端，告诉 AI “帮我看看这段代码”。Claude Code 内置了 `Cmd+Option+K` 快捷键用于此功能（选中文代码行后，生成 `@file#L1-10` 引用格式粘贴到终端输入），但该功能存在 **Bug**：当同时打开多个 Claude Code 终端时，引用会被粘贴到**非当前选择的终端**，而不是用户期望的活动终端。

### 1.2 需求

开发一个 VSCode 扩展，实现和 Claude Code 内置 `Cmd+Option+K` 类似但更可靠的功能：

1. **选中代码行** → 生成 `@relative/path/file.ts#L1-10` 格式的引用（不是代码原文）
2. **发送到当前活动终端** 的输入区，不自动执行（不加回车）
3. 不需要支持多选区
4. 快捷键可自定义

### 1.3 使用场景

典型工作流：用户在编辑器中查看代码 → 选中需要 AI 分析的代码行 → 按快捷键 → 终端中出现 `@src/xxx.ts#L42-58 ` 引用 → 用户在前面输入 prompt → 回车发送给 Claude Code。

---

## 二、开发过程回顾

### 2.1 整体时间线

整个 Mission 在 **2026-06-12** 一天内完成，走的是 devflow 轻量路径：

```
Mission Init → Align → Plan → Apply → Verify
                                       ↓
                              追加需求：终端自动重命名
                                       ↓
                                  Apply → Verify
                                       ↓
                                  放弃重命名 → Close
```

### 2.2 各阶段概要

| 阶段 | 内容 |
|------|------|
| **Align（对齐）** | 确认快捷键方案（`Cmd+Shift+L`，用户可覆盖）、相对路径基准（workspaceFolder）、项目位置（当前仓库 `vscode-extensions/`）、发送后追加空格 |
| **Plan（计划）** | 5 个文件的小型扩展，核心逻辑约 30 行（`extension.ts`），改动范围清晰 |
| **Apply（实施）** | 创建项目骨架 → 实现核心逻辑 → 编写 README → 编译打包为 `.vsix` |
| **Verify（验证）** | 编译通过，但用户侧安装测试未完成（`code` CLI 不在 PATH 中） |
| **追加需求** | 用户希望终端自动重命名（将 Claude Code 终端名改为当前文件路径）→ 探索 3 种方案后放弃 |
| **Close** | 扩展功能完成，终端重命名不可行已记录，Mission 关闭 |

---

## 三、核心实现

### 3.1 技术方案

扩展结构极简，只涉及 5 个文件：

```
vscode-extensions/vscode-send-ref-to-terminal/
├── package.json          # 扩展元数据、命令注册、默认快捷键
├── src/extension.ts      # 核心逻辑（~30 行）
├── tsconfig.json         # TypeScript 编译配置
├── .vscodeignore         # 打包排除规则
└── README.md             # 使用说明
```

### 3.2 核心逻辑（extension.ts）

```typescript
// 1. 获取活动编辑器的选区信息
// 2. 计算文件相对于 workspace 的路径
// 3. 拼接引用格式：@path#L{start} 或 @path#L{start}-{end}（多行时）
// 4. 通过 terminal.sendText(ref, false) 发送到活动终端（false = 不执行）
```

### 3.3 关键设计决策

| 决策点 | 选择 | 原因 |
|--------|------|------|
| 快捷键 | `Cmd+Shift+L`（Mac）/ `Ctrl+Shift+L` | 与 Claude Code 的 `Cmd+Option+K` 区分，避免冲突 |
| 快捷键可覆盖 | 通过 `package.json` 设默认值 + VSCode keybindings 机制 | 用户可在 VSCode 快捷键设置中自定义 |
| 相对路径基准 | `workspaceFolder`（`vscode.workspace.asRelativePath`） | 与 Claude Code 的引用格式保持一致 |
| 尾部空格 | 发送后追加空格 | 方便用户直接在引用后面继续输入 prompt |
| 单行 vs 多行 | `L42` vs `L42-58` | 根据选区起始行是否相同自动判断 |
| 异常处理 | 无编辑器/无终端时弹出警告提示 | 对用户友好，避免静默失败 |

### 3.4 命令与快捷键

- **命令 ID**：`sendRefToTerminal.send`
- **命令名称**：`Send File Reference to Terminal`
- **默认快捷键**：`Cmd+Shift+L`（Mac）/ `Ctrl+Shift+L`（Windows/Linux）
- **触发条件**：`editorTextFocus`（编辑器聚焦时可用）

---

## 四、终端自动重命名探索（已放弃）

### 4.1 需求背景

用户希望 Claude Code 终端能自动重命名为当前编辑的文件路径，方便在多个终端间快速定位。

### 4.2 尝试过的方案

| 方案 | 原理 | 失败原因 |
|------|------|----------|
| **方案 1：Hook stdout 输出转义序列** | 在 UserPromptSubmit hook 脚本中 `printf '\e]0;<name>\a'` 输出终端改名转义序列 | Hook stdout 被 Claude Code 捕获作为 hook result，不会到达终端 pty |
| **方案 2：Hook 直接写入 tty 设备** | Hook 脚本绕过 stdout，直接向 `/dev/ttysXXX` 写入改名序列 | Hook 进程没有关联 tty，无法写入终端设备 |
| **方案 3：Hook 写文件 + 扩展监听 + sendText** | Hook 将目标名称写入文件 → VSCode 扩展监听文件变化 → 通过 `terminal.sendText()` 发送改名序列 | 能改名，但 Claude Code 自身也通过转义序列管理终端名，会立即覆盖 |

### 4.3 结论

Claude Code 会根据对话内容自动通过转义序列设置终端名，外部程序无法持久覆盖。该需求在技术上不可行，已正式放弃。

---

## 五、关键经验与教训（Learnings）

### 5.1 VSCode 终端相关

1. **转义序列改名前提**：VSCode 终端必须设置 `"terminal.integrated.tabs.title": "${sequence}"` 才能响应 `\e]0;xxx\a` 改名序列，否则转义序列不生效。

2. **terminal.sendText 不会触发执行**：第二个参数 `false` 表示只粘贴到输入区不执行，这是实现的关键。

### 5.2 Claude Code Hooks 相关

3. **Hook stdout 被捕获**：UserPromptSubmit hook 脚本的 stdout 会被 Claude Code 拦截作为 hook result 返回，不会到达终端 pty。因此 hook 无法通过 stdout 与终端交互。

4. **Claude Code 自管理终端名**：Claude Code 会根据对话内容自动设置终端标题（如 "Claude Code" 或具体任务名），外部任何改名操作都会被覆盖。

### 5.3 工程实践

5. **轻量路径适用场景**：目标明确、改动范围小、核心逻辑约 30 行的独立扩展，用 devflow 轻量路径完全够用，不需要重流程。

6. **`.vscodeignore` 常见坑**：初始配置错误排除了 `out/` 目录（编译产物），导致打包后扩展无法运行。这是一个经典的 VSCode 扩展打包陷阱。

---

## 六、当前状态与遗留事项

### 6.1 交付物

| 产物 | 路径 |
|------|------|
| 扩展源码 | `vscode-extensions/vscode-send-ref-to-terminal/` |
| 安装包（VSIX） | `vscode-extensions/vscode-send-ref-to-terminal/vscode-send-ref-to-terminal-0.1.0.vsix` |

### 6.2 遗留事项

- [ ] **安装 VSIX 并实际使用验证**：在 VSCode 中通过 `Cmd+Shift+P` → `Extensions: Install from VSIX...` 安装扩展，验证功能是否正常
- [ ] 如需修复问题，可重新打开 Mission

### 6.3 使用前配置建议

```json
// VSCode settings.json（可选，如果想体验终端转义序列改名）
"terminal.integrated.tabs.title": "${sequence}"
```

---

## 七、总结

这是一个典型的**小而美**的工具型扩展开发案例：

- **需求来源**：Claude Code 内置功能的 Bug 驱动
- **开发周期**：1 天内完成从 Align 到 Close 的完整流程
- **核心代码**：仅 ~30 行 TypeScript
- **技术栈**：VSCode Extension API（`vscode.window.activeTerminal.sendText`）
- **失败探索**：终端自动重命名虽然放弃了，但 3 种方案的探索过程非常有价值，记录了 Claude Code Hooks 和 VSCode 终端交互的关键限制
- **待验证**：用户侧安装测试是唯一未完成的环节

整体而言，该扩展精准解决了一个具体痛点，开发过程干净利落，决策记录完整，是一次质量较高的微工具开发实践。