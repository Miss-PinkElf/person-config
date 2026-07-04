# Bug Log

## 2026-07-04：测试文件默认导入导致 TypeScript 编译失败

### 问题现象

执行 `npm run compile` 失败：

```text
src/reference.test.ts(1,8): error TS1259: Module '"node:assert/strict"' can only be default-imported using the 'esModuleInterop' flag
```

随后执行 `npm test` 失败，因为编译未产出 `out/reference.test.js`。

### 问题原因

`src/reference.test.ts` 使用了 `import assert from "node:assert/strict"` 默认导入（Default Import），但当前 `tsconfig.json` 未开启 `esModuleInterop`。这是模块导入方式与编译配置不一致，不是核心引用生成逻辑问题。

### 解决方案

将默认导入改为具名导入（Named Import）：

```typescript
import { equal } from "node:assert/strict";
```

测试断言从 `assert.equal(...)` 改为 `equal(...)`，保持 `tsconfig.json` 不变。
