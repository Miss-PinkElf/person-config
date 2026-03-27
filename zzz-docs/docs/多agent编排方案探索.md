# 多 Agent 编排方案探索

更新时间：2026-03-27

## 想解决的问题

现在更像是人在手动做调度：

- 多开几个终端
- 每个终端跑一个 agent
- 人自己记住谁在干什么
- 人自己切换上下文、做分工、做汇总

目标不是单纯“多开 agent”，而是做出一个更像 `team leader / commander / 总控终端` 的工作台：

- 一个入口统一接收需求
- 自动拆任务
- 把任务分发给不同 agent / 不同终端
- 回收结果
- 做冲突控制、review、合并

## 核心判断

### 1. Zed + ACP 不是完整的 team leader

`Zed + ACP` 更像“统一驾驶舱”或者“统一接入层”：

- ACP 负责把外部 agent 接到编辑器里
- Zed 负责交互、编辑、上下文查看、协作

但 ACP 本身不是那个“老板 agent”。  
它解决的是“怎么接入多个 agent”，不直接等于“怎么调度多个 agent”。

所以如果想实现：

- 这个终端做前端
- 那个终端写测试
- 另一个终端只做 review

通常还需要一个 **编排层 / orchestrator / root agent**。

### 2. 真正的关键不在“多 agent”，而在“任务边界”

如果多个 agent 同时改同一片代码，最后大概率会互相覆盖。

所以多 agent 落地的关键通常是：

- 明确谁负责哪个目录
- 明确谁只能读、谁可以写
- 明确是否必须 worktree / branch 隔离
- 明确最终由谁负责合并和 review

## 工具定位

### 方案 A：Zed + ACP

适合当作统一入口。

优点：

- 编辑器内直接接外部 agent
- 比纯命令行更适合查看上下文、diff、文件树
- 对“多个 agent 接进一个工作区”这件事比较友好

限制：

- 更像“前台”
- 不是强编排器
- 需要外部 runtime 或者人为约束分工

更适合的定位：

- 人作为总控
- Zed 作为控制面板
- 外部 agent runtime 作为执行层

### 方案 B：多 Agent 编排器

这类工具更接近你说的“team leader”。

#### 1. Docker Agent（原 cagent）

特点：

- 支持 root agent + sub-agents
- 支持用配置描述 agent 团队
- 方向偏工程化、正式化
- 可以和 ACP 配合

适合：

- 想要结构清晰的 agent team
- 想要把 agent 拆分成固定角色
- 想把方案长期固化下来

#### 2. AgentPool

特点：

- 明确定位 multi-agent orchestration hub
- 可管理不同类型的 agent
- 有 ACP 集成方向

适合：

- 想做一个更像“调度中心”的中间层
- 后面可能接多种 agent，而不只一个模型生态

#### 3. fast-agent

特点：

- 相对轻量
- 支持 multi-agent workflows
- 可作为 ACP 后端

适合：

- 想先快速验证工作流
- 不想一开始就上很重的编排平台

### 方案 C：可视化指挥台

#### Tide Commander

这类更像“总控终端”产品：

- 面向多个 agent 的可视化管理
- 看状态、看执行、做委派
- 解决“多开终端很乱”的问题

如果你的核心诉求是：

- 我就想有一个 boss panel
- 我想看谁在忙什么
- 我想一键把任务派给不同 worker

这类产品会比“只接 ACP 协议”更贴需求。

### 方案 D：Claude 做总控

#### myclaude

如果你喜欢 Claude 工作流，可以把 Claude 当调度层，用它来：

- 接收需求
- 拆子任务
- 分发给其他执行 agent
- 回收结果

这种思路的重点不是 Zed，而是：

- `Claude / myclaude` 做 orchestrator
- `Codex / Gemini / Claude Code` 等做具体执行

## 可以考虑的 4 条方向

### 方向 1：最稳妥的低成本方案

`Zed + ACP + 人工调度`

做法：

- 先把多个 agent 接进 Zed
- 人自己扮演 leader
- 明确每个 agent 的目录边界和职责

优点：

- 学习成本低
- 很快能开始用
- 不需要马上搭复杂平台

缺点：

- 还是很依赖人脑调度
- 规模一大就会乱

适合阶段：

- 个人开发
- 2 到 3 个 agent 试运行
- 验证自己真正想要的协作模式

### 方向 2：Zed 做前台，编排器做后台

`Zed + ACP + Docker Agent / AgentPool / fast-agent`

做法：

- Zed 提供统一界面
- 编排器负责 root agent 和 worker agents
- 任务在后台被拆分和调度

优点：

- 结构更完整
- 更接近真正的 agent team
- 方便后续扩展角色和流程

缺点：

- 配置复杂度更高
- 调试成本会上来

适合阶段：

- 已经确定要长期使用多 agent
- 不只是玩具级尝试
- 希望把工作流固化

### 方向 3：总控台优先

`Tide Commander + 各类执行 agent`

做法：

- 把“指挥终端”作为第一优先级
- 不强求一开始深度绑定编辑器

优点：

- 最贴近“老板指挥多个终端”这个心智模型
- 可视化更清晰

缺点：

- 可能要适应新的操作面板
- 和现有编辑器工作流的耦合度要再评估

适合阶段：

- 你已经非常确认自己要“总控面板”
- 不想自己拼太多底层模块

### 方向 4：Claude 做 leader

`myclaude / Claude Code + 其他 agent`

做法：

- 用 Claude 系工作流承接调度
- 用其他 agent 负责具体编码、测试、review

优点：

- 更容易把“调度 prompt / slash commands / 角色模板”沉淀下来
- 更像“leader agent + specialist agents”

缺点：

- 方案更偏某个模型生态
- 工具之间的边界需要自己调顺

适合阶段：

- 本来就主要用 Claude
- 想快速搭一个 leader prompt 驱动的团队

## 我更推荐的推进顺序

不要一上来追求“完全自动编排”。  
更现实的路线是分三步。

### 第一步：先验证分工模型

建议直接用：

`Zed + ACP + 明确角色分工`

先只设 3 个角色：

- planner：只拆任务，不改代码
- builder：只负责某个目录下的实现
- reviewer/tester：只看 diff、补测试、验收

先验证的问题：

- 你最常见的任务能不能拆开
- 哪些任务可以并行
- 哪些任务必须串行
- 哪些文件最容易冲突

### 第二步：引入隔离机制

一旦开始并行写代码，就应该考虑：

- 每个 agent 一个 branch
- 或者每个 agent 一个 worktree
- 或者至少每个 agent 一个明确的目录边界

否则 agent 一多，结果会从“并行提效”变成“并行打架”。

### 第三步：再引入真正的 orchestrator

当你已经知道：

- 哪些角色稳定存在
- 哪些任务经常重复
- 你的 merge / review 习惯是什么

再去上：

- Docker Agent
- AgentPool
- fast-agent
- 或者 Tide Commander

这样不会在最开始就被工具复杂度拖住。

## 推荐的角色设计

比较实用的一种团队结构：

### 1. Leader / Planner

职责：

- 接用户需求
- 拆任务
- 选择执行顺序
- 决定哪些任务能并行

限制：

- 默认不直接改代码

### 2. Implementer

职责：

- 只改自己负责的模块
- 输出实现结果和影响范围

限制：

- 不碰其他 agent 的职责目录

### 3. Tester / Verifier

职责：

- 跑测试
- 检查回归
- 看日志和错误

### 4. Reviewer / Integrator

职责：

- 汇总多个 agent 的结果
- 做冲突处理
- 统一最终输出

如果项目不大，可以先把 `Tester` 和 `Reviewer` 合并。

## 关键工程规则

如果未来真要做多 agent 协作，建议从一开始就定规则。

### 1. 文件所有权

例如：

- `src/ui/**` 归前端 agent
- `src/server/**` 归后端 agent
- `tests/**` 归测试 agent

### 2. 输出格式统一

每个 agent 回复都固定包含：

- 做了什么
- 改了哪些文件
- 还剩什么风险
- 是否需要人工确认

### 3. 默认禁止跨边界修改

如果 agent 发现必须改别人的目录：

- 先上报 leader
- 再决定是否重新分派

### 4. 合并口单一

最终必须有一个 integrator 负责：

- 看 diff
- 跑验证
- 决定是否合并

否则多 agent 最后一定乱。

## 一个现实可落地的最小方案

如果现在就想开始，不想研究太久，我会建议：

### 最小可用组合

- 编辑器：Zed
- 接入层：ACP
- 调度方式：先人工 leader
- 执行角色：planner / builder / reviewer
- 隔离方式：按目录分工，必要时 worktree

### 为什么先这样

- 复杂度最低
- 能最快验证你的真实需求
- 不会一上来陷入工具套工具

### 什么时候升级

当你出现这些信号时，再升级到编排器：

- 同时常驻 3 个以上 agent
- 经常需要重复分派类似任务
- 经常忘记哪个 agent 在干什么
- 开始需要任务状态面板
- 开始需要自动回收和汇总结果

## 当前结论

如果你问“有没有一个像 team leader 一样指挥多个终端/agent 的方案”，答案是 **有方向，而且已经有几类现成路线**：

- `Zed + ACP`：适合做统一入口，但不是完整总控
- `Docker Agent / AgentPool / fast-agent`：适合做真正的编排层
- `Tide Commander`：适合做可视化总控台
- `myclaude`：适合 Claude 生态下做 leader 驱动的团队

更务实的路线不是先追求“最强工具”，而是先把下面三件事跑通：

- 任务拆分
- 权责边界
- 合并与验收

这三件事跑通以后，再上任何总控工具都会顺很多。

## 参考链接

- Zed ACP: https://zed.dev/acp
- Zed external agents: https://zed.dev/docs/ai/external-agents
- Zed collaboration: https://zed.dev/docs/collaboration/overview
- Docker Agent: https://docs.docker.com/ai/cagent/
- AgentPool ACP integration: https://phil65.github.io/agentpool/advanced/acp-integration/
- fast-agent ACP: https://fast-agent.ai/acp/
- Claude Code subagents: https://docs.claude.com/en/docs/claude-code/subagents
- Tide Commander: https://tidecommander.com/
- myclaude: https://github.com/cexll/myclaude

