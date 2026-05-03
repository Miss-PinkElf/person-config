# 开源记忆系统可借鉴代码位置清单 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一份面向 `agent-desktop-pet` 落地实现使用的开源记忆系统（Open-source Memory Systems）可借鉴代码位置清单。

**Architecture:** 本轮不修改业务代码，只基于已完成的研究笔记（Research Notes）和本地仓库快照（Local Repository Snapshots）产出 Markdown 文档。文档按桌宠目标设计层拆分，给出每层可借鉴项目、具体代码文件绝对路径、借鉴方式和不建议照搬的边界。

**Tech Stack:** Markdown、PowerShell、本地文件系统、已克隆的 `zzz-memory-demo/` 开源项目快照。

---

### Task 1: 确认可引用源码路径

**Files:**
- Read: `.devflow/desktop-pet-memory-research/research-notes.md`
- Read: `zzz-memory-demo/`

- [x] **Step 1: 提取研究笔记里的关键文件**

从 `research-notes.md` 读取每个项目的关键证据文件，优先使用已经被研究过的源码入口。

- [x] **Step 2: 验证本地文件存在**

使用 `Resolve-Path` 和 `Test-Path` 检查关键文件，确认文档中引用的绝对路径不指向缺失文件。

### Task 2: 生成可借鉴代码位置清单

**Files:**
- Create: `zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md`

- [ ] **Step 1: 写结论先行**

说明开源项目对当前桌宠记忆系统设计（Desktop Pet Memory System Design）的价值：验证分层、提供实现参考、帮助控制实现复杂度。

- [ ] **Step 2: 按设计层写映射**

覆盖以下设计层：

```text
信号层（Signal Layer）
事件记忆（Episodic Memory）
兴趣画像（Interest Profile）
关系记忆（Relationship Memory）
记忆图谱（Memory Graph）
回忆服务（RecallService）
反思记忆（Reflective Memory）
用户治理（User Governance）
```

- [ ] **Step 3: 按项目写代码位置**

每个项目写清楚：

```text
可借鉴什么
适配到你的哪一层设计
关键源码绝对路径
落地建议
不建议照搬什么
```

### Task 3: 更新 devflow 状态

**Files:**
- Modify: `.devflow/desktop-pet-memory-research/state.md`
- Modify: `.devflow/desktop-pet-memory-research/checkpoints.md`

- [ ] **Step 1: 更新 state.md**

记录本轮新增文档路径和当前阶段。

- [ ] **Step 2: 更新 checkpoints.md**

保留最近检查点，新增“可借鉴代码位置清单已生成”的检查点。

### Task 4: 验证文档质量

**Files:**
- Read: `zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md`

- [ ] **Step 1: 检查绝对路径**

确认文档包含 `D:\Users\Mobius\Desktop\mine\AAA-code\person-config\zzz-memory-demo\` 前缀的绝对路径。

- [ ] **Step 2: 检查双语术语**

确认关键专业术语首次出现采用中文 + English 格式，例如记忆图谱（Memory Graph）。

- [ ] **Step 3: 检查落地导向**

确认文档不是项目介绍，而是能指导另一个项目按层查代码、按优先级借鉴。
