# 开源记忆系统对比研究 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成开源记忆系统（Open-source Memory Systems）探索，并形成面向桌宠记忆系统（Desktop Pet Memory System）的对比报告和优化建议。

**Architecture:** 本轮是研究与文档任务，不修改业务代码。先把关键仓库克隆到 `zzz-memory-demo/`，再按统一维度抽取项目设计，最后汇总到 `zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`。

**Tech Stack:** GitHub 仓库源码、Markdown 文档、PowerShell、`git`、本地文件系统。

---

### Task 1: 准备研究目录与仓库清单

**Files:**
- Create: `zzz-memory-demo/README.md`
- Modify: `.devflow/desktop-pet-memory-research/state.md`

- [ ] **Step 1: 创建研究目录说明**

写入 `zzz-memory-demo/README.md`，说明该目录只存放外部项目快照（External Project Snapshots），各项目不保留 `.git`。

- [ ] **Step 2: 建立待探索仓库清单**

使用以下仓库作为主清单：

```text
https://github.com/mem0ai/mem0
https://github.com/NevaMind-AI/memU
https://github.com/getzep/graphiti
https://github.com/memodb-io/memobase
https://github.com/letta-ai/letta
https://github.com/zhongwanjun/MemoryBank-SiliconFriend
https://github.com/Anson-Trio/BaiShou
https://github.com/code-with-Anson/LifeBook
https://github.com/lioensky/VCPToolBox
https://github.com/lioensky/VCPChat
https://github.com/langchain-ai/langmem
```

- [ ] **Step 3: 更新 mission 状态**

在 `.devflow/desktop-pet-memory-research/state.md` 记录研究目录与清单已确认。

### Task 2: 克隆外部项目快照

**Files:**
- Create: `zzz-memory-demo/<project>/`
- Modify: `.devflow/desktop-pet-memory-research/state.md`

- [ ] **Step 1: 克隆主清单项目**

对每个项目执行浅克隆（Shallow Clone）：

```powershell
git clone --depth 1 <repo-url> zzz-memory-demo/<project-name>
```

- [ ] **Step 2: 移除各仓库 `.git` 目录**

对每个克隆完成的项目删除内部 `.git`，保留源码快照。

- [ ] **Step 3: 记录无法克隆的项目**

如果某个项目不存在、网络失败或默认分支异常，在 `state.md` 记录项目名、现象、原因和替代处理方式。

### Task 3: 逐项提取架构信息

**Files:**
- Create: `.devflow/desktop-pet-memory-research/research-notes.md`
- Modify: `.devflow/desktop-pet-memory-research/state.md`

- [ ] **Step 1: 为每个项目读取入口文档**

优先读取：

```text
README.md
docs/
examples/
pyproject.toml / package.json
主要 src / backend / server / memory 目录
```

- [ ] **Step 2: 按统一维度记录**

每个项目记录以下内容：

```text
定位（Positioning）
核心架构（Architecture）
记忆对象（Memory Objects）
写入流程（Write Path）
召回流程（Recall Path）
存储方式（Storage）
时间机制（Temporal Model）
关系 / 图谱机制（Relationship / Graph Model）
反思 / 总结机制（Reflection Model）
隐私与控制（Privacy / Control）
适配桌宠价值（Companion Fit）
不适合照搬的点（Risks）
```

- [ ] **Step 3: 更新状态**

在 `state.md` 记录已完成分析的项目列表和剩余项目。

### Task 4: 写横向对比与架构判断

**Files:**
- Modify: `.devflow/desktop-pet-memory-research/research-notes.md`

- [ ] **Step 1: 按路线分类**

将项目归入：

```text
检索型记忆（Retrieval Memory）
上下文管理型记忆（Context Management Memory）
时间图谱型记忆（Temporal Graph Memory）
画像 / 事件流记忆（Profile / Timeline Memory）
陪伴型记忆（Companion Memory）
知识库 / 工具型记忆（Knowledge / Tool Memory）
```

- [ ] **Step 2: 对比现有桌宠记忆内核**

对照 `桌宠最终记忆系统详解.md`，判断现有系统和每类方案的关系：

```text
已具备什么
缺什么
可以借鉴什么
不建议引入什么
下一阶段如何最小增量实现
```

### Task 5: 产出最终研究报告

**Files:**
- Create: `zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
- Modify: `.devflow/desktop-pet-memory-research/state.md`
- Modify: `.devflow/desktop-pet-memory-research/checkpoints.md`

- [ ] **Step 1: 写报告正文**

报告结构：

```text
1. 结论先行
2. 现有桌宠记忆系统定位
3. 开源项目逐项分析
4. 横向对比表
5. 对现有 Memory Kernel 的启发
6. 推荐优化路线
7. 暂不建议做的事情
8. 下一阶段可执行任务
```

- [ ] **Step 2: 更新 devflow 状态**

在 `state.md` 记录最终报告路径和当前阶段结论。

- [ ] **Step 3: 写收尾 checkpoint**

在 `checkpoints.md` 记录研究完成情况、产物路径和后续建议。

### Task 6: 验证研究产物

**Files:**
- Read: `zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
- Read: `.devflow/desktop-pet-memory-research/research-notes.md`

- [ ] **Step 1: 检查报告覆盖范围**

确认报告覆盖主项目：

```text
mem0
memU
Graphiti
Memobase
Letta
MemoryBank / SiliconFriend
```

- [ ] **Step 2: 检查双语术语**

确认关键专业术语首次出现使用中文 + 英文，例如：记忆图谱（Memory Graph）、反思记忆（Reflective Memory）。

- [ ] **Step 3: 检查结论可执行性**

确认报告不只是介绍项目，而是明确给出现有桌宠记忆系统（Desktop Pet Memory System）的后续优化顺序。
