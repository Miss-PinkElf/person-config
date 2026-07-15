# Clash 代理无法上网排查记录：7890 端口被 Windows 保留

## Metadata（元数据）

| 字段 | 内容 |
|---|---|
| 创建时间（Created At） | 2026-07-13 21:02 |
| 更新时间（Updated At） | 2026-07-13 21:02 |
| 作者（Author） | Codex + 用户协作整理 |
| 目的（Purpose） | 记录 Clash 开启系统代理后浏览器报 `ERR_PROXY_CONNECTION_FAILED`、无法上网的排查过程、根因与修复方案；并附带终端强制不走代理的临时方法 |
| 关联仓库 / 项目（Related Repository / Project） | `person-config`（个人环境配置与运维笔记）；排查对象为本机 Clash for Windows（`E:\APP\Clash\Clash for Windows`） |
| 关联 mission（Related Mission） | 无（本机网络 / 代理环境问题，不属于桌宠业务 mission） |
| 当前状态（Status） | 已完成（Completed）：根因已定位，推荐方案为更换 mixed-port |
| 文档边界（Scope / Boundary） | 运维排查笔记，不是业务代码真相源；不代表已修改 Clash 配置，仅记录当时结论与操作建议 |

---

## 1. 现象（What happened）

1. 开启 Clash 系统代理（System Proxy）后，浏览器无法访问网站。
2. 浏览器报错类似：
   - `你尚未连接`
   - `代理服务器可能有问题，或地址不正确`
   - `ERR_PROXY_CONNECTION_FAILED`
3. 用户说明：
   - 已开启代理
   - **未开 TUN（增强模式）**
   - 模式为 **规则模式（Rule）**
   - Clash 安装路径：`E:\APP\Clash\Clash for Windows`
4. 并行诉求：开发时希望 **终端不走代理**，避免 Codex / 本地开发被代理拖垮。

---

## 2. 前因后果与决策逻辑（Why we did it this way）

### 2.1 问题链路（因果）

当时真实链路是：

1. 系统代理打开 → 浏览器/系统把流量导向 `127.0.0.1:7890`
2. Clash 内核尝试在 `7890` 上启动 Mixed（HTTP+SOCKS）服务
3. Windows 拒绝绑定该端口（端口落在系统“排除端口范围”里）
4. **7890 实际没有监听**
5. 浏览器去连代理地址失败 → `ERR_PROXY_CONNECTION_FAILED`
6. 表现成“一开代理就断网”；关系统代理后恢复直连，更容易误判成“节点坏了 / 规则坏了”

### 2.2 为什么先查端口，而不是先换节点

| 方向 | 是否优先 | 原因 |
|---|---|---|
| 先查本地 `7890` 是否监听 | **是** | `ERR_PROXY_CONNECTION_FAILED` 的字面含义是“连不上代理本身”，不是“代理连上了但目标站失败” |
| 先怀疑节点失效 | 否（次要） | 若代理端口都没起来，节点好坏还轮不到 |
| 先怀疑规则模式写错 | 否（次要） | 规则模式只影响“连上代理之后怎么分流”，连不上代理时规则不起作用 |
| 先怀疑 TUN | 否（次要） | 用户已说明未开 TUN；日志里 TUN 权限错误可记一笔，但不是本次浏览器报错的直接原因 |

**决策原则：** 代理类问题按层次排查——  
**代理进程是否在跑 → 本地代理端口是否在听 → 系统代理是否指向正确地址 → 节点是否可用 → 规则/DNS 是否异常。**

### 2.3 为什么推荐“换端口”，而不是优先“腾出 7890”

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把 `mixed-port` 改成未保留端口（如 `10808`） | 快、稳、对 WSL/Hyper-V/Docker 影响小 | 需要同步改系统代理端口 | **推荐首选** |
| 用管理员重启 WinNAT / 调整系统保留端口，强行腾出 7890 | 可继续用习惯端口 7890 | 可能影响 WSL2、Docker、Hyper-V；保留段可能再次生成，问题易复发 | 备选，不优先 |

### 2.4 关于“终端不走代理”的约束与取舍

用户希望：代理开着时，**终端/Codex 尽量直连**，浏览器等可以走代理。

| 做法 | 作用范围 | 限制 |
|---|---|---|
| 当前 PowerShell 会话清空 `HTTP_PROXY` / `HTTPS_PROXY`，并设 `NO_PROXY=*` | 仅当前终端会话 | 对“读环境变量的工具”有效 |
| 单条命令 `curl --noproxy "*"` | 仅该命令 | 不影响其他程序 |
| Clash 侧关 TUN、用系统代理 + 规则模式 | 全局架构选择 | TUN 开着时，环境变量常拦不住 |
| 改 PowerShell profile 永久去代理 | 每个新终端默认生效 | 本次用户说“单次即可”，因此只给会话级命令 |

**约束：** 若开了 TUN，仅清环境变量往往不够；本次用户未开 TUN，会话级去代理即可。

---

## 3. 排查证据（当时实测）

### 3.1 Clash 进程在，但关键端口未监听

- 进程存在：`Clash for Windows.exe`、`clash-win64.exe`
- `7890`：**未监听**
- `9966`（external-controller）、`1053`（DNS listen）在部分时刻也不稳定/未监听

说明：GUI 在跑，不代表本地代理端口已成功启动。

### 3.2 日志关键错误

路径大致在：

`C:\Users\Mobius\.config\clash\logs\`

关键行：

```text
Start Mixed(http+socks) server error: listen tcp :7890: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
Start Tun interface error: error creating interface: Access is denied.
```

含义：

1. **Mixed 端口 7890 绑定失败** → 这是本次“代理连不上”的直接根因
2. TUN 创建失败（权限不足）→ 与本次“未开 TUN 仍报代理连接失败”是旁支问题

### 3.3 Windows 排除端口范围（Excluded Port Range）

```text
netsh interface ipv4 show excludedportrange protocol=tcp
```

当时可见保留段中包含：

```text
7881 - 7980
```

而 Clash 配置：

```yaml
mixed-port: 7890
```

**7890 正好落在 7881–7980 内。**

这是 Windows 常见现象：端口“看起来没人占用”，但系统已预留，普通程序 `bind` 会被拒绝。常见关联组件：Hyper-V、WSL2、Docker、Windows NAT 等。

### 3.4 配置位置摘要

| 项 | 路径 / 值 |
|---|---|
| Clash 安装目录 | `E:\APP\Clash\Clash for Windows` |
| 运行配置目录 | `C:\Users\Mobius\.config\clash\` |
| `config.yaml` | 含 `mixed-port: 7890` |
| 活跃订阅配置（当时 index 指向“魔戒.net”一类 profile） | `profiles\1783946716436.yml`，其中也是 `mixed-port: 7890`，`mode: rule` |
| 系统代理（某次检查时） | `ProxyEnable=0`（取决于用户是否刚开关过系统代理） |

---

## 4. 根因一句话

**不是订阅节点本身的问题，而是 Clash 无法在本机绑定 `7890`：该端口位于 Windows 的 TCP 排除端口范围（7881–7980）内，导致本地代理服务没有启动；开启系统代理后，浏览器去连一个不存在的本地代理，于是报 `ERR_PROXY_CONNECTION_FAILED`。**

---

## 5. 例子说明（把抽象概念讲清楚）

### 例子 A：代理端口没起来 vs 节点挂了

把代理想成“门卫岗亭”：

1. **岗亭根本没开门**（本机 `7890` 没监听）  
   - 你把所有访客都先指到岗亭  
   - 访客到门口发现没人 → `ERR_PROXY_CONNECTION_FAILED`  
   - 这与“岗亭后面的高速公路是否通畅”（节点是否可用）无关

2. **岗亭开着，但后面公路断了**（节点失败）  
   - 浏览器通常不是 “Proxy Connection Failed”  
   - 更常见是超时、连接重置、或特定网站打不开，而代理本身仍能连上

本次属于第 1 种。

### 例子 B：为什么“端口没占用却绑不上”

- 你在停车场看到某个车位空着（`netstat` 看不到占用）
- 但车位被物业划成“预留车位”（Windows excluded port range）
- 你把车开进去会被拦下（`bind: access permissions`）

所以：

```text
端口空闲 ≠ 端口可绑定
```

### 例子 C：终端去代理为什么“单次会话”就够

```powershell
Remove-Item Env:HTTP_PROXY,Env:HTTPS_PROXY,Env:ALL_PROXY,Env:http_proxy,Env:https_proxy,Env:all_proxy -ErrorAction SilentlyContinue
$env:NO_PROXY='*'
$env:no_proxy='*'
```

含义：

- 只改 **当前这个 PowerShell 窗口** 的环境变量
- 关掉窗口即失效
- 适合“我现在要跑 Codex / npm / git，不想走代理”的临时场景
- 若 Clash 开了 TUN，这套方法经常无效，因为流量在网卡层已被接管

---

## 6. 修复方案

### 6.1 推荐：更换 mixed-port（首选）

把端口从 `7890` 改为 **不在保留段** 的端口，例如：

- `10808`
- `10809`
- `17890`
- `51880`

当时已知应避开的段包括：

- `6983-7082`
- `7183-7582`
- `7681-7780`
- `7881-7980`（**7890 就在这里**）
- `50000-50059`

操作建议：

1. 打开 Clash for Windows
2. General（常规）中修改 Mixed Port / Port 为 `10808`（示例）
3. 或修改配置中的 `mixed-port: 7890` → `mixed-port: 10808`
4. 重启 Clash 内核 / 完全退出后重开
5. 重新打开系统代理，并确认代理地址为 `127.0.0.1:10808`（不是旧的 7890）

验证：

```powershell
Test-NetConnection 127.0.0.1 -Port 10808
curl.exe -x http://127.0.0.1:10808 -I --connect-timeout 8 https://www.baidu.com
```

期望：

- `TcpTestSucceeded = True`
- `curl` 能返回 HTTP 头，而不是 `Failed to connect ... 7890/10808`

### 6.2 备选：强行腾出 7890（不优先）

管理员 PowerShell：

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
net stop winnat
net start winnat
```

然后重启 Clash，再测 `7890` 是否可监听。  
缺点：可能影响 WSL/Docker/Hyper-V，且保留段可能再次出现。

### 6.3 终端单次不走代理（开发场景）

当前 PowerShell 会话执行：

```powershell
Remove-Item Env:HTTP_PROXY,Env:HTTPS_PROXY,Env:ALL_PROXY,Env:http_proxy,Env:https_proxy,Env:all_proxy -ErrorAction SilentlyContinue; $env:NO_PROXY='*'; $env:no_proxy='*'
```

确认：

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match 'proxy|PROXY' }
```

单次 curl 直连：

```powershell
curl.exe --noproxy "*" -I --connect-timeout 8 https://www.baidu.com
```

---

## 7. 推荐排查顺序（以后同类问题可复用）

1. **看报错类型**  
   - `ERR_PROXY_CONNECTION_FAILED` → 优先查本地代理端口是否监听  
2. **看进程**  
   - Clash GUI / `clash-win64` 是否在跑  
3. **看端口**  
   - `Test-NetConnection 127.0.0.1 -Port <mixed-port>`  
4. **看日志**  
   - `Start Mixed ... bind ... forbidden / access permissions`  
5. **看 Windows 排除端口**  
   - `netsh interface ipv4 show excludedportrange protocol=tcp`  
6. **再查节点、规则、DNS**  
   - 只有本地代理已成功监听后才有意义  

---

## 8. 结论清单

1. 本次断网主因：**7890 被 Windows 保留，Clash Mixed 服务启动失败**。
2. 浏览器报错符合“系统代理指向了未启动的本地代理”。
3. 优先修复：**换 mixed-port 到安全端口（如 10808）并同步系统代理**。
4. 终端开发去代理：当前会话清空 `HTTP(S)_PROXY` 并设 `NO_PROXY=*` 即可；未开 TUN 时通常有效。
5. TUN 权限错误、节点质量、规则细节属于后续问题，不是本次 `ERR_PROXY_CONNECTION_FAILED` 的直接原因。

---

## 9. 后续可选动作（未在本文实施）

1. 在 Clash 中实际改端口并验证上网（需用户本机操作确认）。
2. 若希望每个新终端默认不走代理，可再写入 PowerShell profile（当时用户只要单次命令，故未改 profile）。
3. 若坚持使用 7890，再评估 WinNAT / Hyper-V / WSL 对排除端口的影响。
