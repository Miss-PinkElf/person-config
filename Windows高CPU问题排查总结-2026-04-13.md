# Windows 高 CPU 问题排查总结 - 2026-04-13

## 问题现象

2026-04-13 这次故障里，任务管理器持续出现以下服务主机占用很高：

- `服务主机: Local Session Manager`
- `服务主机: DCOM 服务进程启动器`
- `服务主机: 显示增强服务`

当时总 CPU 一度达到 `100%`，其中单个服务组经常在 `20%` 到 `35%` 左右波动。

## 最终结论

根因不是 `svchost.exe` 本身异常，而是一个第三方虚拟显示驱动把 Windows 的显示、会话、即插即用这条链路搅乱了。

最终确认的问题驱动是：

- `GameViewer Virtual Display Adapter`
- 设备实例：`ROOT\DISPLAY\0000`
- 驱动包：`oem75.inf`
- 原始驱动文件：`GameViewerIddDriver.inf`

把这个设备移除，并卸载对应驱动包之后，高 CPU 问题恢复正常。

## 为什么会怀疑这个驱动

### 1. 高占用服务组的形态不对

高占用的不是普通应用进程，而是这些系统链路：

- 会话管理
- DCOM
- Power
- Plug and Play
- Background Tasks Infrastructure
- 显示增强

这种组合更像是“某个设备或驱动在反复触发系统事件”，而不是单个应用程序自己在吃满 CPU。

### 2. 停掉显示增强服务后，CPU 确实下降了一部分

做 A/B 测试时，停止 `Display Enhancement Service` 后，CPU 有所下降，但没有完全恢复。

这说明：

- 显示链路确实参与了问题
- 但 `Display Enhancement Service` 不是唯一根因

### 3. 系统里存在一个额外的虚拟显示设备

检查显示设备时，除了正常的 Intel 和 NVIDIA 显卡外，还发现了一个额外设备：

- `GameViewer Virtual Display Adapter`

当时设备状态是：

- `ROOT\DISPLAY\0000`
- `Started`

虚拟显示驱动本来就是这类问题的高风险项，因为它会直接挂到显示栈和会话栈上。

### 4. 系统日志直接点名了这个设备

在系统事件日志里，能看到和它直接对应的报错：

- `2026-04-13 12:52:29`：`ROOT\DISPLAY\0000` 加载 `\Driver\WUDFRd` 失败
- `2026-04-13 14:20:13`：`ROOT\DISPLAY\0000` 再次加载 `\Driver\WUDFRd` 失败

这里的 `WUDFRd` 是用户模式驱动框架，和虚拟显示、间接显示驱动就是同一条链路。

也就是说，这不是“碰巧附近有个驱动”，而是日志明确指向了这个设备。

## 这个驱动是什么时候装上的

从 `C:\Windows\INF\setupapi.dev.log` 里查到了明确安装记录。

### 安装时间

- `2025-11-20 21:03:33`

### 安装来源

日志里记录的安装命令是：

```text
"D:\uuyc\GameViewer\bin\drivers\devcon.exe" install "D:\uuyc\GameViewer\bin\drivers\GameViewerIddDriver\GameViewerIddDriver.inf" "Root\GameViewerIddDriver"
```

这说明它不是 Windows 自己生成的，而是 `GameViewer` 主程序主动安装进去的。

### 安装后的关键信息

- 设备描述：`GameViewer Virtual Display Adapter`
- 对应设备：`ROOT\DISPLAY\0000`
- 发布到系统后的 INF：`oem75.inf`
- 驱动日期：`2024-05-16`
- 驱动版本：`17.13.25.697`

## 最终修复动作

真正解决问题的动作是把这个虚拟显示设备和驱动包一起删掉。

处理顺序如下：

1. 移除设备

```powershell
pnputil /remove-device ROOT\DISPLAY\0000
```

2. 卸载驱动包

```powershell
pnputil /delete-driver oem75.inf /uninstall /force
```

## 修复成功的日志证据

`setupapi.dev.log` 里还能看到后续删除记录：

### 设备删除时间

- `2026-04-13 14:41:15`

对应操作：

```text
pnputil.exe /remove-device ROOT\DISPLAY\0000
```

### 驱动卸载时间

- `2026-04-13 14:41:20`

对应操作：

```text
pnputil.exe /delete-driver oem75.inf /uninstall /force
```

日志里还能看到这些成功信息：

- `Delete Device - ROOT\DISPLAY\0000`
- `Driver Uninstall (DrvSetupUninstallDriver) - oem75.inf`
- `Unpublished 'oem75.inf'`
- 驱动目录从 `DriverStore` 成功删除

之后问题恢复正常。

## 这次判断为什么算是“坐实了”

这次不是拍脑袋判断，而是完整证据链闭环：

1. 任务管理器里是典型的会话/设备事件型高占用。
2. 停掉 `Display Enhancement Service` 后，CPU 有下降，说明显示链路参与其中。
3. 系统里存在第三方虚拟显示设备 `GameViewer Virtual Display Adapter`。
4. 系统日志直接报 `ROOT\DISPLAY\0000` 和 `WUDFRd` 相关错误。
5. 驱动安装日志明确写出它是 `GameViewer` 装进去的。
6. 删除设备和驱动包之后，问题立刻恢复。

这条链路已经足够把根因定在这个驱动上。

## 额外发现的风险项

这次排查里还发现了一个额外异常服务：

- 服务名：`8J6E2xc9bzrRbZAbkV`
- 启动类型：`Automatic`
- 运行身份：`LocalSystem`
- 启动路径：

```text
cmd /c cd /d "C:\Users\ElysiaEden\AppData\Local\3efUd\bBNS\tq9cW\" && start "" "C:\Users\ElysiaEden\AppData\Local\3efUd\bBNS\tq9cW\HccNx0GB8W.exe"
```

这个服务很可疑，后续已经手动删除：

```powershell
sc.exe config 8J6E2xc9bzrRbZAbkV start= disabled
sc.exe delete 8J6E2xc9bzrRbZAbkV
```

需要注意的是：

- 这个服务本身确实是风险项
- 但它不是这次 `Local Session Manager` / `DCOM` 高 CPU 的直接主因
- 因为删掉它之后，高 CPU 还在
- 真正解决问题的是删掉 `GameViewer` 虚拟显示驱动

## 后续建议

- 如果不需要 `GameViewer` 的虚拟显示功能，建议不要再装回这个驱动。
- 如果 `GameViewer` 主程序还在，建议评估是否彻底卸载。
- 以后如果再遇到类似现象，优先检查：
  - 任务管理器里的高占用服务组
  - `事件查看器 -> Windows 日志 -> 系统`
  - `pnputil /enum-devices /class Display`
  - `C:\Windows\INF\setupapi.dev.log`
- 继续留意第三方底层组件，特别是：
  - `AlibabaProtect`
  - 随机命名、`LocalSystem` 权限、自启动的服务

## 可复用命令

列出显示设备：

```powershell
pnputil /enum-devices /class Display
```

移除虚拟显示设备：

```powershell
pnputil /remove-device ROOT\DISPLAY\0000
```

卸载对应驱动包：

```powershell
pnputil /delete-driver oem75.inf /uninstall /force
```

查询驱动安装历史：

```powershell
Select-String -Path 'C:\Windows\INF\setupapi.dev.log' -Pattern 'gamevieweridddriver.inf|oem75.inf|ROOT\\DISPLAY\\0000' -Context 2,6
```

## 一句话总结

这次高 CPU 的根因，是 `GameViewer` 安装的虚拟显示驱动 `GameViewer Virtual Display Adapter` 触发了显示/会话/即插即用链路异常；删除 `ROOT\DISPLAY\0000` 和 `oem75.inf` 后，问题恢复正常。
