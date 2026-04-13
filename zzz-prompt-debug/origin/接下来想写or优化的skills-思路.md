看看能不能优化一下 context-budget-explore这个skills，再加一层
真的想要可以维护，需要一总的目录，来记录，spec的工件，都有什么，概述一下，
name：
desc：
origin_prompt
orign_plan
time
要有开发的记录，让AI，同时根据这个建立一个RAG，这样好找
其实再加上，test，也不算是test，就是得需要一个类似claude的 computer use，或者别的AI可以操作的东西，agent-broswer，或者midscenejs，
加上日志，还有那个长上下文skills，不就是，AI工程？
生成系分，自己补充细节
或者说是origin+prd---->系分/plan

说不定可以参考的项目：
- https://github.com/thedotmack/claude-mem
- https://github.com/Fission-AI/OpenSpec
- 我自己的.claude\skills\context-budget-explore这个skills
- https://github.com/obra/superpowers
- https://github.com/github/spec-kit

## 当前结论（2026-04-02）

- `context-budget-explore` 现在更像 mission 层 skill，适合单个长任务、单个需求、单个 change。
- 如果一个项目里会反复出现多个需求、多个 mission、跨任务复用经验和恢复历史，就应该再加一个 project 层 skill。
- 这个新 skill 不应该取代 `context-budget-explore`，而应该在它外层做 orchestration / registry / retrieval。

### 新 skill 建议职责

- 管理一个项目下的多个 mission，而不是只管理一个 `.explore/<mission>/`
- 维护项目级 registry / timeline / current state / mission map
- 决定当前是新开 mission，还是续接已有 mission
- 需要进入单个任务时，再调用 `context-budget-explore`

### 推荐分层

1. project 层 skill：项目级 orchestration / registry / retrieval
2. `context-budget-explore`：单个 mission 的长期记录与恢复
3. `spark-workflow` / `session-handoff`：具体执行与暂停恢复

### 下一步

- 先定新 skill 的名字、description 和触发条件
- 再定项目级目录结构和真相源文件
- 最后决定先写设计文档，还是直接起草 `SKILL.md`
