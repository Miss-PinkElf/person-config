---
name: codex-websearch-proxy
description: 当需要把网页搜索请求委托给 Codex 进行外部采集，但仍由 Claude 负责后续筛选、理解和总结时使用。适用于：需要旁路替代内置 WebSearch、需要把查询交给 Codex 只返回结构化搜索结果、或需要验证 Codex 侧搜索输出是否稳定。不要用于网页正文抓取；那属于 codex-webfetch-proxy。不要在本 skill 中让 Codex 输出解释型自然语言。
---

# codex-websearch-proxy

把搜索请求委托给 Codex，但把 Codex 严格限制为**结构化采集器**。

## 核心边界

- Codex 只负责搜索与返回结构化结果。
- Claude 负责后续的筛选、理解、总结与引用。
- 不允许让 Codex 输出解释型自然语言。
- 优先要求 Codex 返回 JSON；当前阶段只要结构化且可消费即可，严格最终 schema 可后续再收敛。
- 不要用本 skill 抓取网页正文；正文抓取交给 `codex-webfetch-proxy`。

## 何时使用

在这些场景触发：

1. 用户或当前工作流明确希望把搜索动作委托给 Codex。
2. 当前任务要验证 Codex 是否能稳定返回结构化搜索结果。
3. 需要一个旁路搜索器，而不是调用 Claude Code 内置 `WebSearch`。
4. 后续结论仍准备由 Claude 主模型完成，而不是让 Codex 直接总结。

不要在这些场景使用：

- 你只需要直接读取一个已知 URL。
- 你要抓取网页正文或 markdown 内容。
- 你希望模型直接给最终答案而不是中间采集结果。

## 输入约定

向 Codex 描述时，至少给出：

- `query`：搜索词
- 可选约束：语言、站点、时间范围、结果数量偏好

如果用户没有指定结果数量，默认让 Codex返回前 5 条以内的高相关结果。

## 输出契约

理想情况下，Codex 只返回以下两类 JSON 之一，且**不要使用代码块围栏**，不要添加前后解释。

当前阶段以“能返回结构化、可消费结果”为主；如果字段 shape 有轻微漂移，但仍能明确识别为搜索结果，可暂时接受，并在后续迭代中收敛。

### 成功

```json
{
  "type": "websearch_result",
  "query": "openclaw 用法",
  "results": [
    {
      "title": "...",
      "url": "...",
      "snippet": "...",
      "source": "...",
      "rank": 1
    }
  ],
  "warnings": []
}
```

约束：

- `type` 必须是 `websearch_result`
- `query` 必须回填实际执行的查询词
- `results` 必须始终为数组
- `results` 可为空数组 `[]`，表示没有找到可用结果
- `rank` 从 1 开始递增
- `warnings` 必须始终为数组；没有告警时返回 `[]`

### 失败

```json
{
  "type": "error",
  "stage": "search",
  "message": "...",
  "retryable": true
}
```

约束：

- `type` 必须是 `error`
- `stage` 对本 skill 固定为 `search` 或 `parse`
- `message` 简洁说明失败原因
- `retryable` 为布尔值

## 推荐执行提示词模板

把下面这类指令交给 Codex，并按实际任务替换变量：

```txt
请执行网页搜索，只做结果采集，不要做总结，不要解释，不要给建议。

查询词：<query>
附加约束：<constraints>

输出要求：
1. 只能输出严格 JSON
2. 不要使用 ```json 代码块
3. 不要在 JSON 前后输出任何解释文字
4. 成功时输出 type=websearch_result
5. 失败时输出 type=error
6. 如果没有结果，返回 results: []，不要改成自然语言说明
7. warnings 字段必须存在，且始终为数组
```

## Claude 侧消费规则

收到 Codex 输出后，Claude 应先做这些检查：

1. 是否为合法 JSON
2. `type` 是否属于 `websearch_result | error`
3. `results` / `warnings` 是否满足数组约束
4. 是否混入了 JSON 之外的解释文字

如果 Codex 混入自然语言，应视为协议未遵守，而不是直接当成功结果使用。

## 最小测试 prompts

### 测试 1：正常结果

```txt
请用 codex-websearch-proxy 搜索：openai codex cli github
只返回结构化 JSON，不要解释。
```

### 测试 2：无结果分支

```txt
请用 codex-websearch-proxy 搜索：asdkjhaskjdhakjsdhqweqwe site:example.invalid
只返回结构化 JSON，不要解释。
```

### 测试 3：失败 / 解析分支

```txt
请用 codex-websearch-proxy 搜索：openclaw 用法
如果搜索过程失败或无法整理为合法 JSON，必须返回 error JSON，禁止输出解释文字。
```

## 完成定义

只有当满足以下条件时，才算本 skill 使用成功：

- Codex 输出是可解析 JSON
- 只出现 `websearch_result` 或 `error`
- 没有自然语言前后缀
- 空结果与失败分支都能稳定落在协议内
