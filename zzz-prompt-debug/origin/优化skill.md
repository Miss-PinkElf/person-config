/context-budget-explore 使用skill-creator-cc优化一下这个skills，
1. 这个skills，应该还是偏好在claudecode里面使用，能不能，是一个通用的skills
2. 在根目录建一个.explore文件夹
3. 同时一个探索，可以有多次handoff，handoff在文件夹里面，
4. 同时这个skills不要依赖外部的skills，把spark-workflow和session-handoff，放到子skills，里面同时记得修改一下子skills，让它更加贴合主skillls，同时这个skills，
5. 我想往spark-workflow上面靠，就是，做需求，探索,都使用这个skills，相当于在spark-workflow外层有加了一层，让做需要有记录，有过程，让AI更加容易读懂