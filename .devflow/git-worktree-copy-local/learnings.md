# 学习记录（Learnings）

## 2026-09-29：本机 pnpm 不能按 packageManager 切换

- 现象：插件 `package.json` 指定 `pnpm@12.7.0`，本机 pnpm 10.30.1 去启动 `/Users/mobius/Library/pnpm/.tools/pnpm/12.7.0/bin/pnpm` 时得到 `ENOEXEC`。该文件是一段 ASCII 占位说明，不是可执行文件。
- 处理：安装和测试加上 `--config.manage-package-manager-versions=false`，使用当前 pnpm 10.30.1。
- 连带问题：pnpm 10 把现有 `pnpm-lock.yaml` 读成多文档并重写。这次用 `git checkout -- pnpm-lock.yaml` 恢复了锁文件，不把它算进功能改动。
