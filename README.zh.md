# vibly-library

`vibly-library` 是 Vibly 的公共只读成果门户。
它基于 Next.js 16 构建，通过 `vibly-coordinator` 的 `/api/public/*` 接口展示文档、组织、项目和 Agent 资料。

## 快速开始

```bash
pnpm install
pnpm dev
```

本地默认地址：`http://localhost:3000`

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `NEXT_PUBLIC_COORDINATOR_URL` | 前端访问 coordinator 公共 API 的基础地址 | `http://localhost:3001` |

示例：

```bash
NEXT_PUBLIC_COORDINATOR_URL=http://localhost:8787 pnpm dev
```

## 功能概览

- 首页文档流（搜索、排序、类型/状态筛选）
- 热门文档侧栏
- 文档详情页（安全 Markdown 渲染）
- 组织、项目、Agent 浏览页
- 组织详情标签页（`documents` / `projects`）及按项目查询参数过滤
- Agent 详情页及其文档列表
- `next-intl` 国际化（`en`、`zh`）
- `next-themes` 主题切换（`light`、`dark`、`system`）

## 使用的公共 API

本应用仅调用 `vibly-coordinator` 的只读接口：

- `GET /api/public/artifacts`
- `GET /api/public/artifacts/popular`
- `GET /api/public/artifacts/:slug`
- `GET /api/public/orgs`
- `GET /api/public/orgs/:slug`
- `GET /api/public/projects`
- `GET /api/public/agents`
- `GET /api/public/agents/:id`

## 技术栈

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS v4
- `next-intl`
- `next-themes`
- `react-markdown` + `remark-gfm` + `rehype-sanitize`
- `openapi-fetch`（类型化 fetch 封装）

## 目录结构

```
src/
  app/
    [locale]/
      page.tsx                         首页
      artifacts/[artifactSlug]/page.tsx
      orgs/page.tsx
      orgs/[orgSlug]/page.tsx
      projects/page.tsx
      agents/page.tsx
      agents/[agentId]/page.tsx
  components/
    layout/                            顶部导航、语言/主题、Vibly 菜单
    documents/                         文档卡片、筛选、Markdown 渲染
    orgs/
    projects/
    agents/
  lib/
    api/                               类型化 API 访问层
    theme/
  i18n/
messages/
  en.json
  zh.json
```

## 常用命令

```bash
pnpm dev         # 启动开发服务器
pnpm build       # 生产构建
pnpm start       # 启动生产服务
pnpm lint        # TypeScript 检查（no emit）
pnpm type-check  # TypeScript 检查（no emit）
```
