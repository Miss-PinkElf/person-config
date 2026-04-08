优化一下那个context-budget-explore skills，变更一下名字不好记，
每次的plan，最好也可以记录，感觉就是最外层包了一层记录，
其实每次大的修改都需要写plan，或者主动问我，需要plan不
就是现在感觉这个skills，头脑风暴不好触发，也不写plan，话说那个plan，是不是和spec重合了，能不能这样plan还是需要写的，spec指向每一次的plan，
我我这个skill感觉更像是一个长任务的记录？
我最终想要的是，任务有记录，决策有记录，可以接续任务，bug有记录，整个过程有记录，同时有讨论，有思考，有计划
整体来说，整合了 openspec+superpower

- OpenSpec 做主干状态机：
  - 管理变更从 explore/propose/apply/archive 怎么推进
- Superpower 做质量门禁/策略插件：
  - 在每个阶段插入 brainstorming / debugging / review / verification
    也就是一句话：
    OpenSpec 管生命周期，Superpower 管每个节点的思考质量。
    Superpowers 管“怎么思考”，OpenSpec 管“怎么执行”

同时session - handoff，管理任务的交接

你可以参考openspec和sueprpower的所有skills,我也是参考这个的
openspec：https://github.com/Fission-AI/OpenSpec
本地在 这个文件夹下面都是openspec的skills
sueprpower：https://github.com/obra/superpowers
本地在：superpowers/skills