# VS Code 终端重影问题排查总结

## 问题现象

在 Windows 下使用 VS Code 内嵌终端时，调整终端面板大小后会出现重影、旧内容重复打印、提示符和启动横幅残留等现象。

已知环境特征：

- 系统为 Windows 10，截图中版本是 `10.0.19044.7058`
- 终端内使用过 `cmd.exe` 和 `pwsh`
- 问题在终端左右、上下 resize 时出现

## 已排除项

以下方法已经尝试过，但无效：

- 关闭终端 GPU 加速
- 修改终端字体
- 更换 shell：`cmd.exe` -> `pwsh`
- 禁用扩展
- 关闭 shell integration
- 关闭 VS Code 整体硬件加速
- 关闭 persistent sessions
- 尝试 `terminal.integrated.windowsEnableConpty: false`

## 结论判断

这个问题大概率不是字体、单个扩展、shell 本身导致的。

更像是以下两类问题之一：

1. `VS Code / xterm.js / Electron` 在当前机器上的终端重绘问题
2. `Windows 10 19044` 上 `ConPTY` 或底层控制台栈的缓冲同步/重绘问题

这也解释了为什么：

- 改字体没有效果
- 换成 `pwsh` 也没有效果
- 关闭 shell integration 也没有效果
- 关闭终端单独 GPU 加速仍然不解决

## 关于 `windowsEnableConpty`

正确写法是：

```json
{
  "terminal.integrated.windowsEnableConpty": false
}
```

说明：

- `terminal.integrated.windowsEnableConpty`：有效设置
- `windowsEnableConpty`：无效，少了 `terminal.integrated.` 前缀，所以会提示“不允许属性”
- `Conpty: Unknown word.cSpell`：这是拼写检查插件提示，不是 VS Code 配置错误

这个设置的含义是：

- `true`：使用 Windows 的 `ConPTY`
- `false`：回退到旧终端后端

它本来就是一个兼容性回退开关，不是性能优化开关。

## 为什么继续修的价值不高

在下面这些都试过以后，继续折腾 VS Code 内嵌终端的收益已经很低：

- 终端 GPU
- 全局 GPU
- 字体
- shell
- 扩展
- shell integration
- persistent sessions
- ConPTY 开关

如果这些都无效，基本可以认为这是当前机器环境下 VS Code 内嵌终端链路本身不稳定，不太像还能通过再改一两个配置彻底修好。

## 最现实的替代方案

### 方案 1：继续用 VS Code 写代码，终端改用外部 Windows Terminal

这是最务实的方案。

优点：

- 保留 VS Code 的编辑体验和插件生态
- 避开内嵌终端重影问题
- Windows Terminal 的终端体验通常更稳定

适合：

- 纯前端
- Node.js / React / Vue / Next.js / TypeScript 开发

### 方案 2：换 Visual Studio 2022

适合：

- `.NET / C# / C++`
- 希望内嵌终端更接近 Windows Terminal 体验

补充：

- Visual Studio 官方说明其 Terminal 是 built on top of Windows Terminal
- 现在也支持 JavaScript / TypeScript / React / Vue / Angular 开发

### 方案 3：换 Rider

适合：

- `.NET 全栈`
- 既做后端也做前端

补充：

- Rider 使用的是 JetBrains 自己的 terminal engine，不是 VS Code 这一套

### 方案 4：换 WebStorm

结论是：可以试，但不一定值得继续押注。

原因：

- WebStorm 的优势主要在前端 IDE 体验
- 但如果你真正不满意的是“内嵌终端本身”，那换到 WebStorm 也不一定就能从根上解决你的诉求

## 最终建议

如果你是纯前端开发，最推荐：

`VS Code + 外部 Windows Terminal`

如果你是 `.NET` 或 Windows 平台开发，最推荐：

`Visual Studio 2022`

如果你是 `.NET + 前端` 全栈，最推荐：

`Rider`

## 一句话总结

这次问题更像是 VS Code 内嵌终端在当前 Windows 10 环境下的底层重绘/控制台链路问题，不太像还能靠继续改设置彻底修复。最现实的做法是换工作流，而不是继续硬修。
