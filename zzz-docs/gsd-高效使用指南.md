# GSD 高效使用指南

本文基于 `gsd-build/get-shit-done` 仓库的 README、中文 README、User Guide 和 SDK CLI 整理，重点说明：

- 怎么高效使用 GSD
- 怎么让它自动连续跑几个小时
- 常见使用方式
- 常见使用路径
- 常见开发流程

## 1. 核心理解

GSD 的高效用法，不是一直手动盯着它对话，而是让它持续维护项目工作状态文件，然后你只在关键节点介入。

它真正的工作中心通常是项目里的：

```txt
.planning/
```

最值得关注的几个文件：

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/config.json`

如果要提升效率，优先学会看 `ROADMAP.md` 和 `STATE.md`，因为它们分别代表计划和当前进度。

## 2. 安装与验证

### 2.1 Codex 安装

全局安装：

```bash
npx get-shit-done-cc --codex --global
```

本地安装：

```bash
npx get-shit-done-cc --codex --local
```

### 2.2 验证是否可用

```bash
$gsd-help
```

说明：仓库文档明确给了 Codex 的验证命令是 `$gsd-help`。因此在 Codex 中通常使用 `$gsd-*` 形式；在 Claude Code 中文档更多使用 `/gsd-*`。

## 3. 怎么高效使用

### 3.1 最高效的基本原则

1. 旧项目先做代码库映射
2. 大功能先讨论，再计划，再执行
3. 每个 plan 控制得足够小
4. 执行后优先修局部，不要频繁重跑整阶段
5. 长任务尽量让 GSD 管理节奏，你只做验收和纠偏

### 3.2 推荐默认策略

日常开发：

- `interactive + standard + balanced`

快速原型：

- `yolo + coarse + budget`

生产功能：

- `interactive + fine + quality`

这是仓库里明确推荐的三种常见模式。

### 3.3 高效使用的关键习惯

- 旧项目先执行 `map-codebase`，否则它容易误判架构和约定
- 不要跳过 `discuss-phase`，文档明确提到很多计划偏差来自上下文不足
- 每个 plan 最好只放 `2-3` 个任务
- 执行结束后优先用快速修复或验证命令，而不是反复重跑整个 execute 阶段
- 如果项目已经比较稳定，可以逐步提高自动化程度
- 大阶段切换时，建议开新上下文继续，减少历史噪音

## 4. 怎么让它自动跑几个小时

GSD 有两种常见的长时间运行方式。

### 4.1 方式一：在交互式环境里半无人值守运行

适合你还在 Codex 或 Claude Code 里看着它推进，但希望它连续自动跑多个 phase。

典型做法：

1. 初始化项目
2. 把设置调成偏自动
3. 让它连续推进多个 phase

建议配置：

- `mode = yolo`
- `granularity = coarse` 或 `standard`
- `model_profile = budget` 或 `balanced`
- 保留 `research / plan_check / verifier`
- 若项目规则非常稳定，再考虑 `skip_discuss`

常用命令：

```bash
$gsd-discuss-phase 1 --chain
$gsd-autonomous --from 2 --to 5
$gsd-next
```

其中：

- `--chain` 适合从讨论一路串到后续阶段
- `autonomous` 适合让多个 phase 连续推进
- `next` 适合让系统自动判断接下来该做什么

### 4.2 方式二：真正 headless 的长时间自动运行

仓库里提供了 SDK CLI，更适合无人值守、长时间跑、脚本化接入。

安装时附带 SDK：

```bash
npx get-shit-done-cc --codex --global --sdk
```

初始化：

```bash
gsd-sdk init @prd.md --project-dir D:\your-repo
```

自动运行：

```bash
gsd-sdk auto --project-dir D:\your-repo --max-budget 20
```

或者一步完成初始化和自动运行：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

常见参数：

- `--model`
- `--ws-port`
- `--max-budget`

补充说明：

- 仓库没有直接写“可以自动跑几小时”
- 但从 `autonomous` 和 `gsd-sdk auto` 的设计看，它就是为长时间连续推进准备的
- 实际持续时间取决于 phase 数量、测试耗时、模型速度和预算限制

## 5. 必须用 Claude Code 吗，Codex 可以吗

结论：

- 不一定要 Claude Code
- Codex 可以使用 GSD
- 它可以自动跑，但前提是你先启动对应的自动化流程

### 5.1 是否必须用 Claude Code

不必须。

仓库文档明确把 `Claude Code` 和 `Codex` 都列为支持的 runtime。Codex 的常见命令形式是：

```bash
$gsd-help
```

这说明 GSD 并不是只能在 Claude Code 下使用。

不过也需要注意：

- 仓库的大部分叙述和示例明显更偏 `Claude Code`
- 因此 Claude Code 相关的说明更完整、更成熟
- Codex 可以用，但官方文档整体是 Claude-first 风格

### 5.2 Codex 能不能自动跑

可以。

常见有两种方式：

1. 在 Codex 交互会话里半自动推进
2. 用 `gsd-sdk auto` 做真正无人值守运行

交互式半自动示例：

```bash
$gsd-new-project --auto @prd.md
$gsd-autonomous --from 1 --to 4
```

无人值守示例：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

### 5.3 它会不会自己跑

会，但不是“你什么都不做，它自己突然开始跑”。

更准确地说是：

- 你先初始化项目
- 你启动 `autonomous` 或 `gsd-sdk auto`
- 它再按自己的 phase/workflow 连续推进

它自己跑的含义通常是：

- 自动决定下一阶段做什么
- 自动推进研究、计划、执行、验证
- 自动维护 `.planning/` 下的状态文件
- 在满足条件时连续跑多个 phase

它通常会在这些情况下停下：

- 到达你设置的目标 phase
- 预算耗尽
- 构建或测试失败
- 遇到无法自动决策的问题
- 权限或环境限制打断流程

### 5.4 它是怎么跑的

GSD 的“自动跑”本质上不是一股脑乱改代码，而是沿着阶段化流程推进。

典型链路是：

1. `new-project`
2. `discuss-phase`
3. `plan-phase`
4. `execute-phase`
5. `verify-work`
6. `ship` 或 `next`

背后的运行机制通常包括：

- 先根据需求和代码库状态建立上下文
- 再把工作拆成尽量小的 plan
- 然后按 wave 或 phase 执行
- 能并行的部分并行，不能并行的部分顺序推进
- 最后写入总结、验证结果和状态文件

所以它“自己跑几个小时”的核心不是一直输出聊天内容，而是持续推进这些工程步骤。

### 5.5 跑完以后效果是什么样

它的结果更偏工程产物，而不是一大段无结构日志。

你通常会看到：

- `.planning/ROADMAP.md` 被更新
- `.planning/STATE.md` 被更新
- phase 目录下出现 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md` 等文件
- 仓库代码被按阶段逐步修改
- 最终给出阶段数、耗时、成本或执行摘要

从使用体验上看，效果更像：

- 你交给它一份目标
- 它在项目里自己建任务账本
- 它一段时间内持续推进
- 你回来时看到的是计划、状态、代码和验证记录

## 6. 常见使用方法

### 6.1 新项目完整流程

```bash
$gsd-new-project
$gsd-discuss-phase 1
$gsd-plan-phase 1
$gsd-execute-phase 1
$gsd-verify-work 1
$gsd-ship 1
$gsd-next
```

### 6.2 旧项目上增加功能

```bash
$gsd-map-codebase
$gsd-new-project
$gsd-discuss-phase 1
$gsd-plan-phase 1
$gsd-execute-phase 1
```

### 6.3 小需求或快速修改

```bash
$gsd-fast "把登录页按钮文案改成 Sign in"
```

或：

```bash
$gsd-quick
```

### 6.4 中断恢复

```bash
$gsd-progress
$gsd-pause-work
$gsd-resume-work
```

### 6.5 并行推进多个方向

```bash
$gsd-workstreams
$gsd-new-workspace
```

说明：

- `workstreams` 适合同仓库里的多条任务线
- `new-workspace` 适合多仓库或多隔离环境

## 7. 常见使用路径

### 7.1 Codex 安装路径

全局：

```txt
~/.codex/
```

本地：

```txt
./.codex/
```

技能文件通常可在这些位置检查：

```txt
~/.codex/skills/gsd-*/SKILL.md
./.codex/skills/gsd-*/SKILL.md
```

### 7.2 项目运行路径

GSD 的项目状态通常沉淀在：

```txt
.planning/
```

每个 phase 常见文件包括：

- `PLAN.md`
- `SUMMARY.md`
- `CONTEXT.md`
- `RESEARCH.md`
- `VERIFICATION.md`

## 8. 常见开发流程

### 8.1 正常功能开发

```bash
$gsd-map-codebase
$gsd-new-project
$gsd-discuss-phase 1
$gsd-plan-phase 1
$gsd-execute-phase 1
$gsd-verify-work 1
$gsd-next
```

### 8.2 快速原型

```bash
$gsd-new-project --auto @prd.md
$gsd-autonomous
```

推荐配置：

- `yolo`
- `coarse`
- `budget`

### 8.3 前端或 UI 需求

```bash
$gsd-discuss-phase N
$gsd-ui-phase N
$gsd-plan-phase N
$gsd-execute-phase N
$gsd-ui-review N
```

### 8.4 小 bug / 热修

```bash
$gsd-quick
```

完成后直接验证，不建议把整个执行阶段重新完整跑一遍。

## 9. 我建议你的默认用法

如果你是个人开发者，或者主要依赖 AI 辅助开发，建议用下面这一套：

### 9.1 大功能

```bash
$gsd-map-codebase
$gsd-new-project
$gsd-discuss-phase 1
$gsd-plan-phase 1
$gsd-execute-phase 1
$gsd-verify-work 1
$gsd-next
```

### 9.2 小需求

```bash
$gsd-quick
```

或：

```bash
$gsd-fast "需求说明"
```

### 9.3 想让它自动跑很久

交互式：

```bash
$gsd-autonomous --from 1 --to 4
```

无人值守：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

## 10. Codex + GSD 自动长跑操作手册

这一节不是概念说明，而是一份偏实操的最小手册，适合你想让 GSD 在 Codex 里尽量持续自己跑。

### 10.1 先说结论

- 不必须用 Claude Code
- Codex 可以跑 GSD
- 想跑得久，推荐优先用 `gsd-sdk auto`
- 如果你还想在会话里观察过程，用 `$gsd-autonomous`

简单区分：

- 想一边看一边管，用 `Codex + $gsd-autonomous`
- 想尽量无人值守，用 `gsd-sdk auto`

### 10.2 运行前准备

开始前建议满足这些条件：

1. 仓库已经能本地正常安装、构建、测试
2. 旧项目先做代码库映射
3. 需求最好已经写成一个简单的 `prd.md`
4. 权限和环境变量不要频繁弹窗打断
5. 模型预算先设上限，避免无限烧费

最低准备命令：

```bash
$gsd-map-codebase
$gsd-new-project --auto @prd.md
```

如果是全自动方式，通常直接：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

### 10.3 方案一：Codex 里交互式长跑

适合这些场景：

- 你希望它连续跑多个阶段
- 你还想随时观察它当前在做什么
- 中间必要时你愿意手动接管

推荐顺序：

```bash
$gsd-map-codebase
$gsd-new-project --auto @prd.md
$gsd-autonomous --from 1 --to 4
```

更稳一点的分步方式：

```bash
$gsd-discuss-phase 1 --chain
$gsd-autonomous --from 2 --to 5
```

建议配置：

- `mode = yolo`
- `granularity = standard`
- `model_profile = budget` 或 `balanced`

这种方式的特点是：

- 它会持续在当前交互环境里推进 phase
- 你能及时看到它卡在哪一步
- 一旦遇到权限、测试失败、需求歧义，通常更容易人工接管

### 10.4 方案二：SDK 无人值守长跑

这是更适合“跑几个小时”的方式。

安装 SDK：

```bash
npx get-shit-done-cc --codex --global --sdk
```

推荐命令：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

也可以拆开：

```bash
gsd-sdk init @prd.md --project-dir D:\your-repo
gsd-sdk auto --project-dir D:\your-repo --max-budget 20
```

常见参数：

- `--project-dir`：指定项目目录
- `--init`：初始化项目和需求
- `--max-budget`：限制自动运行预算
- `--model`：指定模型
- `--ws-port`：指定 websocket 端口

这种方式的特点是：

- 更接近真正无人值守
- 更适合长时间连续推进
- 结束后更容易直接看 summary 和 `.planning/` 产物

### 10.5 它“自己跑”的真实含义

它不是像守护进程一样永远在后台神秘运行，而是：

1. 你显式启动自动流程
2. 它根据当前项目状态决定下一步
3. 它按 phase/workflow 连续执行
4. 它更新 `.planning/` 里的状态
5. 它在完成、失败、预算耗尽或受阻时停下

所以“自己跑”的本质是：

- 自动推进任务链路
- 自动维护计划和状态
- 自动调用研究、执行、验证步骤

而不是：

- 无需启动
- 无限时间永远不停止
- 完全不受测试、权限、环境约束

### 10.6 它大概按什么顺序跑

通常会沿着类似这样的链路：

1. `new-project`
2. `discuss-phase`
3. `plan-phase`
4. `execute-phase`
5. `verify-work`
6. `next` 或 `ship`

运行过程中通常会发生这些事：

- 读取需求和项目上下文
- 把工作拆成多个更小的计划
- 按 wave 或 phase 执行
- 有机会时并行处理部分任务
- 记录研究、总结、验证结果

### 10.7 你看到的效果会是什么样

如果它确实跑起来了，你回来通常会看到：

- `.planning/ROADMAP.md` 更新了
- `.planning/STATE.md` 更新了
- phase 下新增或更新了 `PLAN.md`
- phase 下新增或更新了 `SUMMARY.md`
- phase 下新增或更新了 `VERIFICATION.md`
- 仓库代码出现阶段性修改
- 终端或 summary 里能看到耗时、阶段数、成本摘要

体验上更像这样：

- 你给它一份目标或 PRD
- 它自己拆任务、推进步骤
- 你过一段时间回来检查状态和结果
- 不满意再人工纠偏，然后继续自动推进

### 10.8 想跑得更久，推荐这样配

如果你的目标是“尽量跑几个小时，不要频繁停”，建议：

- 优先用 `budget` 或 `balanced`
- `granularity` 先用 `standard`
- `mode` 用 `yolo`
- 保留验证和研究，不要过早把安全检查都关掉
- 先在稳定项目试，不要第一次就在高风险仓库上长跑

推荐理解：

- `budget`：更省，适合大批量长跑
- `balanced`：更均衡，适合日常主要配置
- `quality`：更贵，更适合关键节点而不是整晚长跑

### 10.9 它为什么会中途停

最常见的停点有这些：

- 需求不清楚，无法自动决策
- 构建失败
- 测试失败
- 权限弹窗或沙箱限制
- 预算耗尽
- phase 已跑到你设定的上限
- 仓库状态脏得太厉害，影响后续判断

所以要想长跑更稳，核心不是“再加一个命令”，而是先把环境稳定下来。

### 10.10 推荐你直接照抄的两套模板

模板一，适合 Codex 里盯着跑：

```bash
$gsd-map-codebase
$gsd-new-project --auto @prd.md
$gsd-autonomous --from 1 --to 4
```

模板二，适合尽量无人值守：

```bash
gsd-sdk auto --init @prd.md --project-dir D:\your-repo --max-budget 20
```

### 10.11 实际建议

如果你第一次用，建议顺序是：

1. 先用交互式方式跑一轮
2. 看懂 `.planning/STATE.md` 和 `ROADMAP.md`
3. 再上 `gsd-sdk auto`
4. 最后再尝试更激进的自动化配置

这样成本最低，也最不容易在一开始就跑偏。

## 11. 参考来源

- GitHub 仓库主页：https://github.com/gsd-build/get-shit-done/
- 中文 README：https://github.com/gsd-build/get-shit-done/blob/main/README.zh-CN.md
- User Guide：https://github.com/gsd-build/get-shit-done/blob/main/docs/USER-GUIDE.md
- SDK CLI：https://github.com/gsd-build/get-shit-done/blob/main/sdk/src/cli.ts
- SDK package：https://github.com/gsd-build/get-shit-done/blob/main/sdk/package.json
