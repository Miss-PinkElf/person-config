# Controlled Explorer

受控第二文件管理器（Controlled Explorer）是在 VS Code 侧边栏提供的独立文件树。它只展示用户或 AI 主动写入 JSON 配置的文件、文件夹和虚拟分组，不替代原生 Explorer。

## 配置文件

项目级配置路径：

```text
.vscode/controlled-explorer.json
```

全局级配置通过命令“打开全局配置”创建和维护。

配置示例：

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
    },
    { "type": "folder", "path": "src" },
    { "type": "file", "path": "package.json" }
  ]
}
```

## 节点类型

- `group`：虚拟分组，只存在于 JSON 配置中。
- `folder`：真实文件夹，children 从磁盘实时读取。
- `file`：真实文件，点击后打开。

## 主要能力

- 独立 Activity Bar 入口“受控文件”。
- 项目级和全局级 JSON 配置。
- 打开文件、刷新、打开项目配置、打开全局配置。
- Finder / 系统文件管理器显示。
- 新建文件、新建文件夹、重命名、删除到废纸篓。
- 复制绝对路径、复制相对路径。
- 发送路径到终端、在终端中打开。
- 从原生 Explorer 右键“添加到受控文件”。
- 拖拽文件或文件夹到受控视图后写入项目级 JSON。
- 树内拖拽移动真实文件或文件夹。
- 根入口 inline `x` 移除，只修改 JSON，不删除磁盘文件。
- 路径不存在时显示“路径不存在”。
- 默认排序和打开频率排序。

## 排序

默认排序（Default Sort）会按以下顺序整理项目级 JSON：

```text
group -> folder -> file
```

同类型按名称排序。

频率排序（Frequency Sort）只影响视图展示。频率数据存入 VS Code `globalState`，不写回 JSON。

## 开发命令

```bash
npm install
npm test
npm run compile
npm run package
```

打包后会生成 `vscode-controlled-explorer-0.1.0.vsix`。
