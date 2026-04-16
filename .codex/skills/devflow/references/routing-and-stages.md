# 路由与阶段说明

## 四类路径

### 轻量路径

进入信号：

- 目标状态明确
- 改动局部
- 不需要完整三件套 spec

阶段流转：

```text
Mission Init -> Mini Align -> Light Plan -> Light Tasks -> Apply -> Verify -> Close
```

### 重型路径

进入信号：

- 需求有歧义
- 有多个可行方案
- 会影响多个模块、阶段或多轮会话

阶段流转：

```text
Mission Init -> Align -> Plan -> proposal/design/tasks -> Apply -> Review -> Verify -> Close
```

### bug 路径

进入信号：

- 测试失败
- 行为异常
- 根因未知
- 已经出现反复试错

阶段流转：

```text
Classify -> Mission Init -> Debugging -> bug-log -> Verify -> Close
```

### resume 路径

进入信号：

- 用户要求继续上次任务
- 上一个会话已经暂停
- 需要从历史记录恢复当前状态

阶段流转：

```text
Read state -> Read latest checkpoint -> Read latest handoff(if any) -> Reconfirm route -> Align/Plan/Apply
```

### Explore 分支

进入信号：

- 用户明确说先讨论、先调研、先比较方案
- 当前还不该承诺方向
- 需要先做代码调查

阶段流转：

```text
Classify -> Mission Init -> Explore -> Align
```

## Mission Init

`Mission Init` 是正式阶段流转前的启动步骤。

目的：

- 建立 `.devflow/<mission-slug>/` 最小工作区
- 初始化 `workflow.md`、`state.md`、`decision-log.md`
- 明确当前目标、范围、成功标准和路径

如果 mission 已存在，则 `Mission Init` 的职责变为校验并刷新最小骨架，而不是重复覆盖。

## 路径升级与降级

### 从轻量升级为重型

满足任一情况即可升级：

- 发现存在多个核心方案待比较
- 改动实际影响多个模块或阶段
- 需要正式 proposal/design/tasks 管理
- 用户明确要求更完整的过程产物

### 从重型降级为轻量

仅在以下情况下允许：

- 任务收敛后证明只是局部小改
- 不再需要完整三件套
- 用户同意改为轻量路径

无论升级还是降级，都要写入 `state.md`，必要时补充 `decision-log.md`。

## 回退矩阵

| 当前阶段 | 触发情况 | 回退到 |
| --- | --- | --- |
| Align | 新约束大量加入 | 继续 Align |
| Plan | 目标理解偏差 | Align |
| Propose | 方案被推翻 | Align |
| Apply | 发现设计缺陷 | Propose |
| Apply | 连续 3 次修复失败 | Debugging，必要时 Propose |
| Review | 反馈涉及设计改变 | Propose |
| Verify | 验证失败但设计成立 | Apply |
| Verify | 验证失败且设计不成立 | Propose |

## 关闭规则

`Close` 只表示当前阶段或当前轮次收束，不一定意味着 mission 结束。

若 mission 仍会继续：

- 保留工作区
- 写 `checkpoint`
- 在需要交接时写 `handoff`
