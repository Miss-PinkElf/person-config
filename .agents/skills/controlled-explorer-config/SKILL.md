---
name: controlled-explorer-config
description: 维护受控第二文件管理器（Controlled Explorer）的 JSON 配置。用于添加、移除、分组和排序 `.vscode/controlled-explorer.json` 中的受控文件、文件夹和虚拟分组。
---

# Controlled Explorer Config

## 目标

帮助 AI 安全维护受控第二文件管理器（Controlled Explorer）的 JSON 配置，不删除真实磁盘文件。

## 配置位置

优先维护项目级配置：

```text
.vscode/controlled-explorer.json
```

如果用户明确要求全局配置，再维护插件命令“打开全局配置”对应的全局 JSON。

## 配置结构

```json
{
  "version": 1,
  "roots": [
    {
      "type": "group",
      "name": "常用文档",
      "children": [
        { "type": "file", "path": "README.md" },
        { "type": "folder", "path": "docs" }
      ]
    }
  ]
}
```

## 规则

1. 只修改 JSON 配置，不删除真实文件或文件夹。
2. 路径优先使用工作区相对路径。
3. 节点类型只能是 `group`、`folder`、`file`。
4. `group` 可以包含 `children`。
5. 真实目录的 children 不写入 JSON，由插件运行时读取磁盘。
6. 默认排序为 `group` -> `folder` -> `file`，同类型按名称排序。
7. 修改前先读取当前配置，避免覆盖用户已有分组。

## 常见操作

### 添加文件

在 `roots` 或某个 `group.children` 中添加：

```json
{ "type": "file", "path": "src/example.ts" }
```

### 添加文件夹

```json
{ "type": "folder", "path": "docs" }
```

### 添加分组

```json
{
  "type": "group",
  "name": "常用入口",
  "children": []
}
```
