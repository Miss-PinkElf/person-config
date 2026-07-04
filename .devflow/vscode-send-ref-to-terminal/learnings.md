# Learnings

## 2026-07-04：TypeScript Node 内置模块导入方式

在未开启 `esModuleInterop` 的 `tsconfig.json` 中，`node:assert/strict` 不应使用默认导入（Default Import）：

```typescript
import assert from "node:assert/strict";
```

本次改为具名导入（Named Import）后编译与测试通过：

```typescript
import { equal } from "node:assert/strict";
```

## 2026-07-04：VSIX 打包排除规则

`.vscodeignore` 不应排除 `out/`，否则 VS Code 扩展（VS Code Extension）打包后缺少运行产物。

同时建议排除：

- `**/*.map`
- `out/**/*.test.js`
- `node_modules/**`
- `src/**`

这样 VSIX 只保留运行所需文件。

## 2026-07-04：本地 VSIX 与正式发布的差异

`vsce package` 在缺少 `repository` 字段和 LICENSE 文件时会给出警告，但仍可生成本地 VSIX 安装包。若后续要正式发布到 Marketplace，应补齐这些元数据。
