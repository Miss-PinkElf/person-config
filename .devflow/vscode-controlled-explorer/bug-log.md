# 问题清单（Bug Log）

## 2026-07-07：TreeItem contextValue 类型推断导致编译失败

- 问题现象：首次运行 `npm test` 时，TypeScript 编译报错：`"resource"` 和 `"root"` 不能赋给 `ControlledNodeKind`。
- 问题原因：`treeDataProvider.ts` 中 `buildContextValue` 的数组由 `[node.kind]` 推断为 `ControlledNodeKind[]`，后续追加菜单上下文标记（Context Marker）字符串时类型不兼容。
- 解决方案：将数组显式声明为 `string[]`，使 `contextValue` 可以组合节点类型和菜单标记。

## 2026-07-07：默认排序展示可能导致移除根入口删错配置项

- 问题现象：如果 Tree View（树视图）按默认排序展示后，使用 inline `x` 移除根入口，展示索引可能与 JSON 原始索引不一致。
- 问题原因：树数据服务（Tree Data Provider）先排序条目再用排序后的索引生成 `rootIndexPath`，移除配置时会按该索引删除 JSON 中的条目。
- 解决方案：排序展示时保留每个条目的原始索引，`rootIndexPath` 使用原始 JSON 索引；同时补充根路径存在性检查，缺失路径显示 `missing` 节点。
