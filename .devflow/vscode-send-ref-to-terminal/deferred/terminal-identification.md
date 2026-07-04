# 延期项：Claude Code 终端识别（Terminal Identification）

## 延期内容

第一版不自动识别 Claude Code 终端，也不尝试在多个终端中自动选择目标终端。

## 延期原因

VS Code 活动终端（Active Terminal）是当前最稳定、可解释的发送目标。自动识别 Claude Code 终端依赖终端名称或进程特征，容易受 Claude Code 自身终端标题管理影响，稳定性不足。

## 未来触发条件

只有当用户明确需要“非活动终端也能自动定位 Claude Code 终端”时，再重新评估。

## 可能方案

- 暴露配置项（Configuration）让用户指定终端名称关键字。
- 提供命令列出终端并让用户选择目标。
- 继续沿用活动终端，不做自动识别。
