# 经验（Learnings）

## 2026-09-28

- 结果对象的失败工厂不要声明成完整联合类型。失败函数只返回 `{ ok: false; message: string }`，才能赋给更窄的步骤结果。
- 依赖必须在 `vscode-extensions/vscode-quick-open-target/` 里安装。在仓库根目录执行 `npm install` 会因为没有 `package.json` 失败，并留下无关的根目录 `package-lock.json`。
- `.vscodeignore` 可以排除 `src/` 和测试产物，但不能排除整个 `out/`，否则 VSIX 缺少运行文件。
- 本轮按用户要求没有提交插件目录里的 `.gitignore` 和 `tsconfig.json`。它们仍留在工作区，新克隆下来的仓库需要这两份文件才能按现有脚本编译。
