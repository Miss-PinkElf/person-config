### 需求
背景：当我在codex中的额度用完之后，我想在claudecode里面继续开放，想着能不能同步一下对话session，同步完之后，可以用 /resume，之际看到对话
1. 目前，只用同步，grok build，codex cli，claudecode，opencode这四个
2. 你可以先分析每一个agent的session的结构，看看能不能写一个脚本互相转化，如果不能，看看每一个agent是不是有类似的/export这个命令