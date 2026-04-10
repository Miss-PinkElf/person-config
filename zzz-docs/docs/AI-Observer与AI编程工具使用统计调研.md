# AI Observer 与 AI 编程工具使用统计调研

更新时间：2026-04-11

## 1. 背景

这次调研的目标很明确：

- 找能统计 `token` 用量、模型名、请求是否失败、成本或会话情况的工具
- 优先看 `Claude Code` 和 `OpenAI Codex CLI`
- 优先看 `Windows + macOS` 都可用的方案
- 优先看 `本地存储`、`可导出 / 导入`
- 不强制要求开源，但开源方案优先

最终结论是：如果要兼顾 `Windows`、`本地优先`、`Claude Code + Codex CLI`、`错误/trace`、`导入导出`，目前最贴题的仍然是 **AI Observer**。

## 2. 这次是怎么搜的

### 2.1 第一轮：按目标能力搜

先按功能组合搜：

- `Claude Code usage tracker local sqlite export import Windows macOS token usage failed requests model dashboard`
- `Codex CLI usage tracker local storage export import Windows macOS token usage dashboard`
- `LLM usage tracker local desktop app sqlite token costs errors model name Windows macOS`

这轮的目的不是直接找某个产品名，而是先筛出“到底有没有这种类别的软件”。

### 2.2 第二轮：按候选项目反查

第一轮里筛到一些名字后，再反查：

- `AI Observer`
- `SessionPilot`
- `ccusage`
- `Sniffly`

再去看它们的官网、GitHub README、Releases、文档，重点核对：

- 是否明确支持 `Claude Code`
- 是否明确支持 `Codex CLI`
- 是否能看 `token / model / cost / errors / traces`
- 是否支持 `Windows`
- 是否本地存储
- 是否有 `import / export`

### 2.3 第三轮：补查官方和非开源方案

因为你后面说“不必追求开源”，所以又补查了：

- Anthropic 官方 `Claude Code usage analytics`
- OpenAI 官方 `API Usage Dashboard`
- 非开源聚合站点 `AI Code Usage`

这样可以回答一个更实际的问题：  
不是“有没有类似软件”，而是“有没有比 AI Observer 更适合你这组要求的软件”。

## 3. 候选结果梳理

### 3.1 AI Observer

这是本次最推荐的方案。

它的定位非常直接：`Unified local observability for AI coding assistants`。  
根据项目 README，它支持：

- `Claude Code`
- `OpenAI Codex CLI`
- `Gemini CLI`

能看到的内容包括：

- `token usage`
- `costs`
- `API latency`
- `error rates`
- `session activity`
- `logs`
- `traces`

关键点：

- 本地自托管
- 单二进制或 Docker 即可运行
- DuckDB 本地存储
- 支持历史 `JSONL / JSON` 导入
- 支持导出为 `Parquet`
- 支持 `Windows/amd64` 发布构建

适合场景：

- 你想把 `Claude Code` 和 `Codex CLI` 放到同一个本地 dashboard 看
- 你不只想看成本，还想看错误、trace、请求事件
- 你在意数据不出本机

### 3.2 SessionPilot

这是第二接近的方案。

它官网明确写了：

- 支持 `Claude Code / Codex CLI / Gemini CLI`
- `Linux / macOS / Windows`
- self-hosted
- no cloud
- no telemetry

它比较强的是：

- 会话可见性
- 历史检索
- 按项目和模型看成本
- 多账号、多项目汇总

但和 AI Observer 比，它更偏：

- `session cockpit`
- `cost/session/history`

而不是更通用的 `OTLP observability backend`。  
如果你主要是想要“像 Grafana 一样看 logs / traces / errors / telemetry ingestion”，AI Observer 更贴题。

### 3.3 ccusage

这个适合命令行统计，不适合作为完整观测后台。

优点：

- 成熟
- 轻量
- 支持 `Claude Code`
- 有 `@ccusage/codex`
- 可 `--json` 导出

不足：

- 更偏用量和成本分析
- 不擅长做错误追踪和 traces
- 不是一个完整的本地 dashboard 平台

### 3.4 Sniffly

这个适合重视 `Claude Code` 错误与会话分析的人。

优点：

- 本地运行
- usage stats
- error breakdown
- message history

不足：

- 主要是 `Claude Code` 方向
- 对 `Codex CLI` 支持不如 AI Observer 明确
- 导入导出能力不如 AI Observer 完整

### 3.5 官方 / 非开源方案

#### Anthropic 官方 Claude Code usage analytics

这个不是面向本机个人观测台的。

它更偏组织级：

- Team
- Enterprise
- API Console

看的是组织维度：

- 活跃用户
- 会话趋势
- 代码接受率
- 用户维度汇总

它不能直接替代一个本地的 `Claude Code / Codex CLI` 统一观测台。

#### OpenAI 官方 API Usage Dashboard

这个是 API / 账单视角，不是本地 CLI 会话观测台。

能回答：

- 某组织或项目花了多少钱
- 哪些 API 用得多

但不适合回答：

- 某次 `Codex CLI` 请求为什么失败
- 本机某个 session 用了什么模型
- 本地多工具统一会话日志在哪里

#### AI Code Usage

这个方向更像“跨设备同步的云端 dashboard”。

优点：

- Claude/Codex 多设备聚合
- 上手轻

不足：

- 数据会同步到服务端
- 不是本地优先
- 不适合你当前强调的“本地存储、导出导入、自己掌控数据”

## 4. 结论

如果目标是：

- `Windows` 上能用
- 最好 `macOS` 也能复用
- 看 `token / model / cost / error / trace`
- 支持 `Claude Code + Codex CLI`
- 本地存储
- 支持导入导出

目前最合适的是：

1. **AI Observer**
2. **SessionPilot**
3. `ccusage` 作为轻量补充

如果只保留一个结论：  
**优先试 AI Observer。**

原因不是它“最好看”，而是它最完整地命中了这组约束。

## 5. AI Observer 在 Windows 上怎么用

下面写的是面向 `Windows 11 + PowerShell + Docker Desktop` 的最稳妥路径。

### 5.1 你会得到什么

部署完成后，AI Observer 可以在本机 dashboard 里集中看：

- `Claude Code` 指标、日志、trace
- `Codex CLI` 日志和 trace
- 模型名
- token 用量
- 成本
- 请求状态
- 历史导入后的趋势

### 5.2 前置条件

建议先准备：

- `Docker Desktop for Windows`
- `Claude Code`
- `Codex CLI`

如果没有 Docker，也可以直接下载 `AI Observer` 的 Windows 二进制，但 Docker 路径更省事。

### 5.3 方式 A：用 Docker 启动

在 PowerShell 里执行：

```powershell
New-Item -ItemType Directory -Force .\ai-observer-data | Out-Null

docker run -d `
  --name ai-observer `
  -p 8080:8080 `
  -p 4318:4318 `
  -v "${PWD}\ai-observer-data:/app/data" `
  -e AI_OBSERVER_DATABASE_PATH=/app/data/ai-observer.duckdb `
  tobilg/ai-observer:latest
```

说明：

- `8080` 是 Web dashboard
- `4318` 是 OTLP 接收端口
- `.\ai-observer-data` 是本地持久化目录
- 数据库文件会落在 `ai-observer.duckdb`

启动后访问：

```text
http://localhost:8080
```

如果想看容器是否正常：

```powershell
docker ps
docker logs ai-observer
```

### 5.4 方式 B：直接运行 Windows 二进制

去项目的 GitHub Releases 下载 `windows/amd64` 构建，解压后直接运行：

```powershell
.\ai-observer.exe --help
```

常用方式：

- 先看帮助，确认当前版本支持的命令
- 再按帮助信息启动服务

如果想指定数据库位置，可以配环境变量：

```powershell
$env:AI_OBSERVER_DATABASE_PATH = "D:\tools\ai-observer\data\ai-observer.duckdb"
.\ai-observer.exe
```

### 5.5 接入 Claude Code

AI Observer README 给出的 Claude Code 配置是 Unix shell 写法；下面是等价的 PowerShell 版本。

先在 PowerShell 中执行一次持久化设置：

```powershell
setx CLAUDE_CODE_ENABLE_TELEMETRY 1
setx OTEL_METRICS_EXPORTER otlp
setx OTEL_LOGS_EXPORTER otlp
setx OTEL_EXPORTER_OTLP_PROTOCOL http/protobuf
setx OTEL_EXPORTER_OTLP_ENDPOINT http://localhost:4318
setx OTEL_METRIC_EXPORT_INTERVAL 10000
setx OTEL_LOGS_EXPORT_INTERVAL 5000
setx OTEL_LOG_USER_PROMPTS 1
```

然后：

1. 关闭当前终端
2. 新开一个 PowerShell
3. 再启动 `claude`

这样之后，Claude Code 会把本地 telemetry 发到 AI Observer。

如果你不想记录 prompt 内容，可以把：

```powershell
setx OTEL_LOG_USER_PROMPTS 0
```

### 5.6 接入 Codex CLI

在 Windows 上，配置文件路径通常是：

```text
%USERPROFILE%\.codex\config.toml
```

把下面内容加进去：

```toml
[otel]
log_user_prompt = true
exporter = { otlp-http = { endpoint = "http://localhost:4318/v1/logs", protocol = "binary" } }
trace_exporter = { otlp-http = { endpoint = "http://localhost:4318/v1/traces", protocol = "binary" } }
```

然后重新启动 `codex`。

需要注意：

- `Codex CLI` 这边主要导出 `logs + traces`
- README 说明它没有像 Claude Code 那样直接导出 metrics
- AI Observer 会基于日志事件推导一些 Codex 指标

也就是说，Codex 在 AI Observer 里不是“什么都没有”，但表现形式和 Claude Code 不完全一样。

### 5.7 导入历史数据

如果你之前已经有本地 session 文件，可以导入。

如果你是直接运行本机二进制，就在本机执行下面命令。  
如果你是 Docker 部署，则改成：

```powershell
docker exec ai-observer ai-observer import all
```

#### 导入全部

```powershell
ai-observer import all
```

#### 只导入 Claude Code

```powershell
ai-observer import claude-code --from 2025-01-01 --to 2025-12-31
```

#### 只做预览，不真正导入

```powershell
ai-observer import all --dry-run
```

默认路径：

- Claude Code: `~/.claude/projects/**/*.jsonl`
- Codex CLI: `~/.codex/sessions/*.jsonl`
- Gemini CLI: `~/.gemini/tmp/**/session-*.json`

在 Windows 中，这些会映射到你用户目录下对应的隐藏文件夹。

### 5.8 导出数据

如果你是 Docker 部署，对应命令写成：

```powershell
docker exec ai-observer ai-observer export all --output /app/data/export --zip
```

如果你是本机二进制部署，则直接执行下面命令。

导出到目录：

```powershell
ai-observer export all --output .\export
```

导出并打包：

```powershell
ai-observer export all --output .\export --zip
```

导出后的主要文件包括：

- `traces.parquet`
- `logs.parquet`
- `metrics.parquet`
- 附带 views 的 DuckDB 导出数据库

这套输出很适合：

- 备份
- 分享给别的机器分析
- 再用 DuckDB / Python / BI 工具做二次处理

### 5.9 常见问题

#### 1. 打开了 dashboard，但是没有数据

先检查：

- AI Observer 是否在运行
- `4318` 端口是否可达
- Claude/Codex 是否重启过
- 环境变量是否真的生效
- `config.toml` 是否写到了当前用户目录

#### 2. Claude Code 有数据，Codex 数据比较少

这是正常现象之一。  
AI Observer 文档明确写了：

- Claude Code 会发 `metrics + logs`
- Codex CLI 主要发 `logs + traces`

所以两者展示层级不完全对齐。

#### 3. 想迁移机器

最简单的做法：

1. 备份 `ai-observer-data` 目录或 DuckDB 文件
2. 备份 `%USERPROFILE%\.codex\config.toml`
3. 记录 Claude Code 相关环境变量
4. 新机器恢复后重新启动 AI Observer

#### 4. 想完全本地保存，不上云

AI Observer 本身就是本地自托管路线。  
只要你：

- 不接第三方云 observability 服务
- 不主动上传导出文件

数据就会留在本机。

## 6. 什么时候不该选 AI Observer

如果你的目标其实是下面这几类，就不一定要用 AI Observer：

### 6.1 只想做会话和成本总览

如果你不关心 traces / telemetry，只想看：

- 哪个项目跑了多少 session
- 哪个模型花了多少钱
- 会话历史和全文搜索

那 `SessionPilot` 可能会更顺手。

### 6.2 只想命令行快速看统计

如果你不想部署 dashboard，只想：

- 终端里看日报 / 月报
- 导出 JSON
- 算成本

那 `ccusage` 更轻。

### 6.3 接受云同步，不执着本地存储

如果你的优先级变成：

- 多设备汇总
- Web dashboard
- 自动同步

那可以看 `AI Code Usage` 这一类工具。  
但它已经偏离当前“本地存储、自己掌控”的要求。

## 7. 最后的判断

把这次筛选压缩成一句话：

> 目前我查到的方案里，`AI Observer` 是最接近“本地版 Claude Code / Codex 使用观测台”的工具；如果主要关心会话总览和项目管理，则 `SessionPilot` 是第二选择。

## 8. 参考来源

- AI Observer: https://github.com/tobilg/ai-observer
- AI Observer 官网: https://ai-observer.dev/
- SessionPilot: https://session-pilot.com/
- ccusage: https://github.com/ryoppippi/ccusage
- Sniffly: https://sniffly.dev/
- Claude Code monitoring usage: https://docs.anthropic.com/en/docs/claude-code/monitoring-usage
- Claude Code usage analytics: https://support.claude.com/en/articles/12157520-claude-code-usage-analytics
- OpenAI API Usage Dashboard: https://help.openai.com/en/articles/10478918-api-usage-dashboard
- AI Code Usage: https://aicodeusage.com/
