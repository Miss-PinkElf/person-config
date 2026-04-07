---
name: codex-webfetch-proxy
description: 当需要把网页抓取请求委托给 Codex 进行内容采集，但仍由 Claude 负责后续理解、筛选和总结时使用。适用于：需要旁路替代内置 WebFetch、需要让 Codex 抓取指定 URL 并返回结构化正文结果、或需要验证 Codex 侧抓取输出是否稳定。不要用于搜索场景；搜索请用 codex-websearch-proxy。不要在本 skill 中让 Codex 输出解释型自然语言。
---

# codex-webfetch-proxy

把网页抓取请求委托给 Codex，但把 Codex 严格限制为**结构化采集器**。

## 核心边界

- Codex 只负责抓取 URL 内容并返回结构化结果。
- Claude 负责后续理解、提炼、总结和与任务上下文结合。
- 不允许让 Codex 输出解释型自然语言。
- 优先要求 Codex 返回 JSON；当前阶段只要结构化且可消费即可，严格最终 schema 可后续再收敛。
- 不要用本 skill 做搜索；搜索交给 `codex-websearch-proxy`。

## 何时使用

在这些场景触发：

1. 用户或当前工作流明确希望把网页抓取动作委托给 Codex。
2. 当前任务要验证 Codex 是否能稳定返回结构化抓取结果。
3. 已知目标 URL，需要一个旁路抓取器，而不是调用 Claude Code 内置 `WebFetch`。
4. 你只需要正文采集结果，后续理解仍由 Claude 完成。

不要在这些场景使用：

- 你需要先搜索再决定 URL。
- 你只是想让模型直接总结内容，而不关心中间采集契约。
- 页面需要登录、鉴权或明显依赖浏览器交互，而 Codex 无法可靠抓取。

## 输入约定

向 Codex 描述时，至少给出：

- `url`：待抓取 URL
- 可选约束：是否只保留正文、最大内容长度、是否接受重定向摘要

## 输出契约

理想情况下，Codex 只返回以下两类 JSON 之一，且**不要使用代码块围栏**，不要添加前后解释。

当前阶段以“能返回结构化、可消费结果”为主；如果字段 shape 有轻微漂移，例如返回 `content`、`links` 等宽松字段，也可暂时接受，并在后续迭代中收敛。

### 成功

```json
{
  "type": "webfetch_result",
  "url": "https://...",
  "final_url": "https://...",
  "title": "...",
  "content_type": "text/html",
  "status": 200,
  "content_markdown": "...",
  "excerpt": null,
  "warnings": []
}
```

约束：

- `type` 必须是 `webfetch_result`
- `url` 为请求 URL
- `final_url` 为最终落地 URL；无跳转时可与 `url` 相同
- `title` 无法提取时可为空字符串，但字段必须存在
- `content_type` 应尽量提供
- `status` 为整数；未知时也应尽量给出合理值，无法判定时走 `error`
- `content_markdown` 放抓取到的正文 markdown；如果正文过长，可截断，但应在 `warnings` 说明
- `excerpt` 可为 `null`，也可放简短摘要片段
- `warnings` 必须始终为数组；没有告警时返回 `[]`

### 失败

```json
{
  "type": "error",
  "stage": "fetch",
  "message": "...",
  "retryable": true
}
```

约束：

- `type` 必须是 `error`
- `stage` 对本 skill 固定为 `fetch` 或 `parse`
- `message` 简洁说明失败原因
- `retryable` 为布尔值

## 推荐执行提示词模板

把下面这类指令交给 Codex，并按实际任务替换变量：

```txt
请抓取指定 URL，只做内容采集，不要做总结，不要解释，不要给建议。

URL：<url>
附加约束：<constraints>

输出要求：
1. 只能输出严格 JSON
2. 不要使用 ```json 代码块
3. 不要在 JSON 前后输出任何解释文字
4. 成功时输出 type=webfetch_result
5. 失败时输出 type=error
6. 必须包含 warnings 字段，且始终为数组
7. 如果内容过长需要截断，请仍返回合法 JSON，并在 warnings 中说明
```

## Claude 侧消费规则

收到 Codex 输出后，Claude 应先做这些检查：

1. 是否为合法 JSON
2. `type` 是否属于 `webfetch_result | error`
3. `warnings` 是否满足数组约束
4. `status` 是否为整数
5. 是否混入了 JSON 之外的解释文字

如果 Codex 混入自然语言，应视为协议未遵守，而不是直接当成功结果使用。

## 最小测试 prompts

### 测试 1：正常抓取

```txt
请用 codex-webfetch-proxy 抓取：https://github.com/openai/codex/blob/main/README.md
只返回结构化 JSON，不要解释。
```

### 测试 2：失败分支

```txt
请用 codex-webfetch-proxy 抓取：https://example.invalid/not-found
如果抓取失败，必须返回 error JSON，禁止输出解释文字。
```

### 测试 3：重定向或长内容分支

```txt
请用 codex-webfetch-proxy 抓取：https://github.com/openai/codex
如果发生跳转或内容过长，请保持合法 JSON，并把说明写进 warnings。
```

## 完成定义

只有当满足以下条件时，才算本 skill 使用成功：

- Codex 输出是可解析 JSON
- 只出现 `webfetch_result` 或 `error`
- 没有自然语言前后缀
- 失败、跳转、截断等分支都能稳定落在协议内
