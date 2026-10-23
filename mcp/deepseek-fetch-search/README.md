# DeepSeek Web MCP

把 DeepSeek 官方的 **Search API** 和 **Fetch API** 封装成 MCP 工具，供 Claude Code 等支持 MCP 的客户端调用。

- `deepseek_search` —— 调用 DeepSeek 自研搜索引擎检索实时网页
- `deepseek_fetch` —— 抓取单个网页并返回 Markdown 正文

> 这两个工具直接调用 `https://api.deepseek.com/v1/tools/*`，**由 DeepSeek 服务端完成抓取**，不依赖本机网络、代理和 DNS，因此不受本地 fake-ip（Clash 等）和网络限制影响。

---

## 一、能力对比

| 能力 | 实现方 | 说明 |
|---|---|---|
| Claude Code 内置 `WebSearch` | DeepSeek 服务端工具 | 原生支持，无需本 MCP |
| Claude Code 内置 `WebFetch` | **本机客户端** | 本地抓取，会被 `api.anthropic.com` 域名预检和本机网络影响 |
| 本 MCP `deepseek_search` | DeepSeek Search API | 服务端搜索，返回结构化结果 |
| 本 MCP `deepseek_fetch` | DeepSeek Fetch API | 服务端抓取，返回 Markdown |

**适用场景**：本机网络受限、内置 WebFetch 报 `Unable to verify if domain ... is safe to fetch`、或需要稳定可控的服务端抓取时，用本 MCP 替代。

---

## 二、计费

| API | 计价单位 | 单价 |
|---|---|---|
| Search | 每 1000 次**成功**请求 | $0.75 |
| Fetch | 每 1000 次**成功**请求 | $0.75 |

- 只有 **HTTP 200 且返回有效结果**（Search 需非空 `results`，Fetch 需有正文）才计费
- 失败、空结果、超时**不计费**
- `count` 参数不影响价格，按请求次数计费
- 通过本 MCP 直调的是**裸 API**，**立即可计费**；Claude Code 内置 WebSearch 走服务端工具调用，DeepSeek 官方说明该渠道在 **2026-11-01 00:00（北京时间）** 前免费

**限流**（账号级，Search / Fetch 相互独立）：

| API | QPS |
|---|---|
| Search | 100 |
| Fetch | 25（另有按域名的独立限制） |

---

## 三、目录结构

```
mcp/
└── deepseek-fetch-search/
    ├── index.js           # MCP 服务本体（stdio 传输）
    ├── test-mock.mjs      # 零费用测试：本地 Mock 模拟 DeepSeek API（npm test）
    ├── test-client.mjs    # 真实冒烟测试：调用线上 API，产生少量费用
    ├── .env.example       # 密钥配置模板
    ├── .env               # 你自己的密钥（已被 gitignore，不会入库）
    ├── package.json
    ├── package-lock.json
    └── README.md
```

Node 进程由客户端**按会话启停**，不是常驻守护进程，不开端口、不监听 socket。

---

## 四、环境要求

- Node.js ≥ 18（本项目在 v24.13.1 上验证）
- 一个 DeepSeek API Key

---

## 五、安装

```bash
cd /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search
npm install
```

依赖只有两个：`@modelcontextprotocol/sdk`、`zod`。

---

## 六、API Key 配置

本服务**只使用自己的 Key**：不会读取 `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_API_KEY`，也不会读取 `~/.claude/settings.json`。即使 Claude Code 环境里存在这些凭据，也不会被借用。

查找顺序，找到即止：

1. 进程环境变量 `DEEPSEEK_API_KEY`
2. 同目录 `.env` 文件中的 `DEEPSEEK_API_KEY`

### 方式一：本地 `.env`（推荐）

```bash
cd /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search
cp .env.example .env
# 编辑 .env，填入自己的 Key
```

`.env` 内容：

```dotenv
DEEPSEEK_API_KEY=sk-xxxxxxxx
# 可选：自定义 API 根地址
# DEEPSEEK_BASE_URL=https://api.deepseek.com
```

> `.env` 已被仓库根目录 `.gitignore` 中的 `**/.env` 忽略，不会入库。

### 方式二：环境变量

```bash
export DEEPSEEK_API_KEY=sk-xxxxxxxx
```

也可以在注册 MCP 时通过 `-e` 注入（环境变量优先级高于 `.env`）：

```bash
claude mcp add --scope user deepseek-web -e DEEPSEEK_API_KEY=sk-xxx -- \
  $(which node) /绝对路径/deepseek-fetch-search/index.js
```

> 注意：`-e` 会把 Key 明文写进 MCP 配置文件。推荐用 `.env`，让 Key 只保留在一处。

> 高级用法：设置 `DEEPSEEK_MCP_ENV_FILE` 可以指定其他 `.env` 路径（主要供测试或隔离环境使用）。

---

## 七、本地自测

### 零费用测试（推荐）

```bash
cd /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search
npm test
```

用本地 Mock 服务模拟 DeepSeek API，验证 MCP 协议、密钥优先级、转义还原、URL 校验和截断逻辑，**不访问网络、不产生费用**。

### 真实接口冒烟测试

```bash
cd /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search
npm run test:live
```

会打印工具列表，并真实调用一次 Search 和一次 Fetch（产生约 $0.0015 费用）。运行前需要按上一节配置好 Key。预期输出：

```
[deepseek-web] 已启动，API 根地址: https://api.deepseek.com
工具列表: [ 'deepseek_search(query,count,need_content,content_chars,ori_question,localization)',
            'deepseek_fetch(url,max_chars)' ]
--- search ---
搜索「...」共 2 条结果：
...
--- fetch ---
# 页面标题
URL: ...
```

---

## 八、接入 Claude Code

### 方式一：命令行注册（推荐）

```bash
# 全局（所有项目可用）
claude mcp add --scope user deepseek-web -- \
  $(which node) \
  /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search/index.js
```

```bash
# 仅当前项目
claude mcp add --scope project deepseek-web -- \
  $(which node) \
  /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search/index.js
```

> 建议使用 `node` 的**绝对路径**（如 `/Users/mobius/.nvm/versions/node/v24.13.1/bin/node`），避免从 GUI 或非 nvm 环境启动 Claude Code 时找不到 `node`。

### 方式二：手动写配置

用户级：`~/.claude.json` 的 `mcpServers` 字段；项目级：项目根目录 `.mcp.json`。

```json
{
  "mcpServers": {
    "deepseek-web": {
      "type": "stdio",
      "command": "/Users/mobius/.nvm/versions/node/v24.13.1/bin/node",
      "args": [
        "/Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search/index.js"
      ],
      "env": {}
    }
  }
}
```

**注册后需要重启 Claude Code** 才会加载新服务。可用 `/mcp` 查看连接状态。

### 验证是否生效

重启后直接对 Claude 说：

> 用 deepseek_search 搜一下 "DeepSeek V4 发布"

能看到 `deepseek_search` 工具被调用即成功。

---

## 九、工具参数

### `deepseek_search`

| 参数 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `query` | string | ✅ | - | 搜索词，1–128 字符 |
| `count` | int | - | 10 | 返回条数 1–50，不影响计费 |
| `need_content` | bool | - | false | 是否附带每条结果正文 |
| `content_chars` | int | - | 4000 | `need_content=true` 时每条正文的最大字符数 |
| `ori_question` | string | - | - | 触发本次搜索的原始问题，提升检索理解 |
| `localization` | string | - | - | 用于本地化结果的 IP 地址 |

支持的查询运算符：

| 运算符 | 示例 | 说明 |
|---|---|---|
| `site:` | `DeepSeek site:github.com` | 限定站点，多个用 `OR` 连接 |
| `-site:` | `DeepSeek -site:example.com` | 排除站点 |
| `-` | `DeepSeek -advertisement` | 排除含该词的结果 |
| `"..."` | `DeepSeek "release notes"` | 精确短语 |
| `-"..."` | `DeepSeek -"release notes"` | 排除精确短语 |
| `lang:` | `DeepSeek lang:zh,en` | 限定语言 |
| `after:` | `DeepSeek after:2025-01-01` | 发布时间下限 |
| `before:` | `DeepSeek before:2026-06-01` | 发布时间上限 |

### `deepseek_fetch`

| 参数 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `url` | string | ✅ | - | 目标 URL：http/https、带主机名、不含用户名/密码、≤ 8192 字符；不合法时本地直接报错 |
| `max_chars` | int | - | 60000 | 返回正文最大字符数，超出截断并提示 |

---

## 十、实现说明

1. **密钥隔离**
   只读取 `DEEPSEEK_API_KEY`：进程环境变量优先，其次同目录 `.env`。不会读取 `ANTHROPIC_*` 或 `~/.claude/settings.json`。

2. **转义还原**
   DeepSeek Fetch 返回的 Markdown 会对抗标点做反斜杠转义（`\.` `\;` `\/` `\#` 等）。本服务会还原这些转义，但**跳过围栏代码块和行内代码**（包括 `` ``a`b`` `` 这类双反引号代码段），避免破坏正则、Windows 路径、代码片段。`summary` / `snippet` 按官方定义是纯文本，不做反转义。

3. **URL 本地校验**
   非 http/https、缺少主机名、包含用户名/密码或超过 8192 字符的 URL 会被直接拒绝，不发起请求。

4. **截断**
   按 Unicode 码点截断，不会把 emoji 等代理对切成半个字符。

5. **错误处理**
   所有失败统一返回 MCP 的 `isError: true`，文本中包含 HTTP 状态码与 DeepSeek 返回的 `error.message`。

6. **超时**
   Search 30 秒，Fetch 60 秒（`AbortSignal.timeout`）。

7. **日志**
   全部输出到 **stderr**，避免污染 stdio 上的 MCP 协议帧。

8. **截断提示**
   内容被截断时会明确标注原文长度和未返回的字符数，便于决定是否调大 `max_chars`。

---

## 十一、常见问题

**Q：会不会误用 Claude Code 的 Key？**
不会。服务只读 `DEEPSEEK_API_KEY`（环境变量或本目录 `.env`）；即使 Claude Code 环境里存在 `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_API_KEY`，也不会使用。

**Q：改了 `.env` 为什么不生效？**
环境变量优先级高于 `.env`；另外 MCP 进程由客户端按会话启动，修改后需要重启会话（或在 `/mcp` 中重连）才会重新读取。

**Q：这个 MCP 需要一直挂在后台吗？**
不需要。stdio 类型的 MCP 由客户端在会话启动时拉起、会话结束时回收；空闲时不发网络请求，只占约 50MB 内存。同时开多个 Claude Code 会话会有多个实例。

**Q：和内置 WebFetch 有什么区别？**
内置 WebFetch 是**本机抓取**（本地 HTTP → 转 Markdown → 调模型总结），受本机网络、代理、`api.anthropic.com` 域名预检影响；本 MCP 走 **DeepSeek 服务端抓取**，不经过本机网络。

**Q：内置 WebFetch 报 `Unable to verify if domain ... is safe to fetch` 怎么办？**
两种选择：
- 改用本 MCP 的 `deepseek_fetch`
- 或在 `~/.claude/settings.json` 顶层加 `"skipWebFetchPreflight": true` 跳过域名预检（仍走本机网络）

**Q：为什么 Fetch 返回的内容被截断了？**
默认上限 60000 字符。调大 `max_chars`（最大 200000）即可，但会显著增加上下文 token。

**Q：可以只启用其中一个工具吗？**
MCP 服务会同时暴露两个工具，但只有实际调用才计费，不调用不花钱。

---

## 十二、卸载

```bash
# 移除 MCP 注册
claude mcp remove deepseek-web --scope user

# 删除代码
rm -rf /Users/mobius/Documents/111AAA-code/person-config/mcp/deepseek-fetch-search
```
