# 问题清单（Bug Log）

## 2026-09-28：路径解析编译失败

- 问题现象：`tsc` 报 `TS2322`，`OpenTargetResult` 不能赋给 `StepResult<WorkspaceRoot>`。
- 问题原因：`fail()` 的返回类型声明成了完整的成功/失败联合。TypeScript 认为这个返回值也可能是成功结果，所以不能交给只接受失败分支的步骤函数。
- 解决方案：把 `fail()` 的返回类型收窄为 `{ ok: false; message: string }`。修改后 `npm test` 通过。
