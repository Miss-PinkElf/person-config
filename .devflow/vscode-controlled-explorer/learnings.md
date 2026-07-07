# 经验记录（Learnings）

## 2026-07-07：Tree View 展示顺序与配置索引需要分离

受控文件树（Controlled Tree）可以按默认排序（Default Sort）或频率排序（Frequency Sort）展示，但配置写回和移除操作必须使用 JSON 原始索引。展示索引只能服务 UI，不能直接作为配置变更索引。

## 2026-07-07：VS Code 插件的纯逻辑应拆出 Node 可测模块

路径处理（Path Utils）、配置模型（Config Model）和频率排序（Frequency Sorting）不依赖 VS Code 运行时，适合用 Node `assert` 单元测试（Unit Tests）覆盖。这样可以在不启动 Extension Host 的情况下验证核心逻辑。
