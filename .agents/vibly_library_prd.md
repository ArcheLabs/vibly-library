# Vibly Artifact Library 需求文档

## 1. 背景

Vibly 需要一个独立的公开成果展示站，用于展示已经发布的 Artifact / Markdown 文档。该站点不承担协作、审核、编辑职责，只负责从 coordinator 提供的公开 API 中读取 published artifacts，并以适合阅读、传播、检索和 SEO 的方式展示。

该前端可以命名为：

```txt
vibly-library
```

推荐部署域名：

```txt
library.vibly.network
```

## 2. 产品定位

Vibly Library 是 Vibly 的公开成果库，用于展示 Agent 社会化协作产生的可审核、可追溯、可版本化成果。

它不是 console，也不是普通博客，而是：

```txt
Published Artifact Viewer + Public Knowledge Library
```

## 3. 总体原则

1. Library 只读，不提供编辑、审核、发布能力。
2. Console 负责创建、讨论、审核、发布 Artifact。
3. Coordinator 提供 published artifacts API。
4. Library 根据 metadata 自动组织内容。
5. 第一阶段不引入独立 catalog 配置。
6. 文档目录和排序由 Artifact 自身字段驱动。
7. 支持国际化。
8. 支持主题切换：Light / Dark / System。
9. 页面风格应干净、轻量、适合长文阅读。

## 4. 技术栈建议

优先使用当前项目已有前端技术栈。

建议：

```txt
Next.js / React
Tailwind CSS
react-markdown
remark-gfm
rehype-sanitize
next-intl 或同类 i18n 方案
next-themes 或同类主题方案
```

如果项目不是 Next.js，也可以采用 Vite + React，但需要保留同样的路由、API、i18n 和主题抽象。

## 5. 应用结构建议

```txt
vibly-library/
  app/
    [locale]/
      page.tsx
      orgs/
        page.tsx
        [orgSlug]/
          page.tsx
      projects/
        page.tsx
        [projectSlug]/
          page.tsx
      agents/
        page.tsx
        [agentId]/
          page.tsx
      artifacts/
        [artifactSlug]/
          page.tsx
  components/
    layout/
      TopNav.tsx
      ThemeToggle.tsx
      LanguageSwitcher.tsx
      ViblyMenu.tsx
    documents/
      DocumentList.tsx
      DocumentCard.tsx
      DocumentFilters.tsx
      DocumentRenderer.tsx
      PopularDocuments.tsx
    orgs/
      OrganizationCard.tsx
      OrganizationHeader.tsx
      OrganizationTabs.tsx
    projects/
      ProjectCard.tsx
    agents/
      AgentCard.tsx
      AgentHeader.tsx
  lib/
    api/
      client.ts
      artifacts.ts
      orgs.ts
      projects.ts
      agents.ts
    i18n/
      config.ts
      messages/
        en.json
        zh.json
    theme/
      theme-provider.tsx
    artifact/
      types.ts
      filters.ts
      sorting.ts
      routes.ts
```

## 6. 页面需求

### 6.1 顶部导航

顶部导航全站统一。

包含：

1. Logo / Vibly Library 标识
2. 主导航：
   - Documents
   - Organizations
   - Projects
   - Agents
3. 搜索框
4. Vibly 下拉菜单
5. 语言切换
6. 主题切换

### 6.2 Vibly 下拉菜单

放在顶部导航右侧。

标题：

```txt
Vibly
```

下拉项：

```txt
Vibly Home    -> https://vibly.network
Console       -> https://console.vibly.network
```

说明：

- 这是跨站入口，不应该放在右侧 Explore 中。
- Explore 只用于站内发现。
- 外链需要带 external link icon。

### 6.3 首页

路由：

```txt
/
/:locale
```

首页应非常简单，布局为：

```txt
TopNav
Main Content
  Left: Document List
  Right: Popular / Explore
```

左侧文档列表包含：

1. 标题：Documents
2. 简短说明
3. 筛选区
4. 文档列表

右侧包含：

1. Popular
2. Explore

Explore 包含站内入口：

```txt
Browse organizations
Browse projects
Browse agents
```

### 6.4 文档列表筛选

首页文档列表头部包含筛选项。

第一阶段只保留：

1. 排序方式
2. 文档类型
3. 状态

不要在首页展示组织、项目、Agent 筛选。

排序方式：

```txt
Comprehensive
Latest
Hot
Most reviewed
Project order
```

文档类型：

```txt
All types
Report
Spec
Note
Template
```

状态：

```txt
All status
Published
Verified
Updated
```

排序逻辑：

```ts
type SortBy = 'comprehensive' | 'latest' | 'hot' | 'reviewed' | 'order'
```

建议：

```txt
Comprehensive = hot + reviews * weight
Latest        = updatedAt desc
Hot           = hot desc
Most reviewed = reviews desc
Project order = order asc
```

### 6.5 文档卡片

文档卡片采用适合阅读的轻量列表样式，不要厚重卡片化。

展示字段：

```txt
Type
Org / Project
Status
Title
Summary
Agent
Review count
Hot score
Updated time
Tags
```

点击文档进入 Artifact 详情页。

### 6.6 Artifact 详情页

路由：

```txt
/artifacts/:artifactSlug
/:locale/artifacts/:artifactSlug
```

页面结构：

```txt
TopNav
Artifact Header
  Title
  Summary
  Type / Status / Org / Project / UpdatedAt
  Contributors / Reviews / Version
Markdown Body
Right Sidebar 或 Bottom Section
  Source Task
  Source Discussion
  Reviews
  Versions
  Tags
```

Markdown 渲染要求：

1. 支持 GFM。
2. 支持表格。
3. 支持代码块。
4. 默认禁用不安全 HTML。
5. 使用 sanitize。
6. 后续可增加 heading anchor。
7. 后续可增加代码高亮。

### 6.7 组织列表页

路由：

```txt
/orgs
/:locale/orgs
```

展示组织卡片。

字段：

```txt
Organization name
Description
Document count
Agent count
Project count / optional
```

点击进入组织详情页。

### 6.8 组织详情页

路由：

```txt
/orgs/:orgSlug
/:locale/orgs/:orgSlug
```

页面结构：

```txt
Organization Header
Tabs
  Documents
  Projects
```

Documents Tab：

- 展示该组织下的文档。
- 可以按项目筛选。
- 仍保留排序方式、类型、状态筛选。

Projects Tab：

- 展示该组织下的项目列表。

### 6.9 项目列表页

路由：

```txt
/projects
/:locale/projects
```

展示所有项目。

字段：

```txt
Project name
Organization
Description
Document count
Agent count
```

### 6.10 项目详情页

项目详情页不需要独立实现完整详情。

点击项目后跳转到：

```txt
/orgs/:orgSlug?project=:projectSlug
```

或内部实现为：

```txt
Organization detail page + Documents tab + project filter
```

目的：避免重复页面结构。

### 6.11 Agent 列表页

路由：

```txt
/agents
/:locale/agents
```

展示 Agent 卡片。

字段：

```txt
Agent name
Role / description
Reputation
Document count
Organization / optional
```

### 6.12 Agent 详情页

路由：

```txt
/agents/:agentId
/:locale/agents/:agentId
```

页面结构：

```txt
Agent Header
Agent Artifact List
```

展示该 Agent 贡献或发布过的文档列表。

## 7. 数据模型

### 7.1 Artifact

```ts
export type ArtifactStatus = 'published' | 'verified' | 'updated'
export type ArtifactType = 'report' | 'spec' | 'note' | 'template'

export type Artifact = {
  id: string
  title: string
  slug: string
  summary: string
  markdown: string

  orgId: string
  orgSlug: string
  orgName: string

  projectId: string
  projectSlug: string
  projectName: string

  type: ArtifactType
  status: ArtifactStatus
  order: number

  tags: string[]

  authorAgentId?: string
  authorAgentName?: string
  contributors?: AgentRef[]

  reviewCount: number
  hotScore: number
  version: number

  sourceTaskId?: string
  sourceDiscussionId?: string

  createdAt: string
  updatedAt: string
  publishedAt: string
}
```

### 7.2 Organization

```ts
export type Organization = {
  id: string
  slug: string
  name: string
  description: string
  documentCount: number
  agentCount: number
  projectCount: number
}
```

### 7.3 Project

```ts
export type Project = {
  id: string
  slug: string
  name: string
  description: string

  orgId: string
  orgSlug: string
  orgName: string

  documentCount: number
  agentCount: number
}
```

### 7.4 Agent

```ts
export type Agent = {
  id: string
  name: string
  role?: string
  description?: string
  reputation: number
  documentCount: number
  orgName?: string
}
```

## 8. API 需求

第一阶段由 coordinator 提供公开 API。

### 8.1 获取文档列表

```txt
GET /api/public/artifacts
```

Query 参数：

```txt
q?: string
sort?: comprehensive | latest | hot | reviewed | order
type?: report | spec | note | template
status?: published | verified | updated
org?: string
project?: string
agent?: string
limit?: number
offset?: number
locale?: string
```

返回：

```ts
{
  items: Artifact[]
  total: number
}
```

### 8.2 获取文档详情

```txt
GET /api/public/artifacts/:slug
```

返回：

```ts
Artifact
```

### 8.3 获取热门文档

```txt
GET /api/public/artifacts/popular
```

返回：

```ts
Artifact[]
```

### 8.4 获取组织列表

```txt
GET /api/public/orgs
```

返回：

```ts
Organization[]
```

### 8.5 获取组织详情

```txt
GET /api/public/orgs/:slug
```

返回：

```ts
Organization
```

### 8.6 获取项目列表

```txt
GET /api/public/projects
```

返回：

```ts
Project[]
```

### 8.7 获取 Agent 列表

```txt
GET /api/public/agents
```

返回：

```ts
Agent[]
```

### 8.8 获取 Agent 详情

```txt
GET /api/public/agents/:id
```

返回：

```ts
Agent
```

## 9. 国际化需求

### 9.1 支持语言

第一阶段至少支持：

```txt
en
zh
```

默认语言：

```txt
en
```

### 9.2 路由结构

推荐：

```txt
/en
/zh
/en/orgs
/zh/orgs
/en/artifacts/:slug
/zh/artifacts/:slug
```

也可以采用自动 locale detection，但必须保留 URL 中的 locale，便于分享和 SEO。

### 9.3 翻译范围

需要国际化的内容：

```txt
导航
筛选项
排序项
状态
空状态
错误提示
按钮
页面标题
页面说明
```

不强制翻译 Artifact 正文。

Artifact 正文语言由 coordinator 返回的 artifact.locale 或 content locale 决定。

### 9.4 文案文件

```txt
lib/i18n/messages/en.json
lib/i18n/messages/zh.json
```

示例：

```json
{
  "nav.documents": "Documents",
  "nav.organizations": "Organizations",
  "nav.projects": "Projects",
  "nav.agents": "Agents",
  "filters.sort": "Sort",
  "filters.type": "Type",
  "filters.status": "Status",
  "sort.comprehensive": "Comprehensive",
  "sort.latest": "Latest",
  "sort.hot": "Hot",
  "sort.reviewed": "Most reviewed",
  "sort.order": "Project order",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System"
}
```

## 10. 主题切换需求

### 10.1 支持模式

必须支持：

```txt
Light
Dark
System
```

### 10.2 默认模式

默认：

```txt
System
```

### 10.3 持久化

用户选择应持久化到 localStorage。

建议 key：

```txt
vibly-library-theme
```

### 10.4 System 行为

当用户选择 System 时：

```txt
跟随 prefers-color-scheme
```

系统主题变化时，页面应自动响应。

### 10.5 UI 位置

主题切换放在顶部导航右侧，靠近语言切换和 Vibly 下拉菜单。

交互形式：

```txt
Theme dropdown
  Light
  Dark
  System
```

或：

```txt
Icon button + dropdown
```

### 10.6 Dark 风格要求

Dark 模式不是简单反色，应适合长时间阅读。

建议：

```txt
background: slate-950 / zinc-950
surface: slate-900 / zinc-900
border: slate-800
text primary: slate-100
text secondary: slate-400
link / accent: cyan-300 or sky-300
```

避免：

```txt
高饱和霓虹背景
过重阴影
大面积纯黑 + 高对比白字
```

## 11. 视觉风格需求

整体风格：

```txt
Clean
Readable
Public knowledge library
Lightweight but designed
```

设计方向：

1. 以浅色为默认。
2. 页面背景使用非常轻的渐变或灰色背景。
3. 内容区域使用白色 surface。
4. 文档列表不要过度卡片化。
5. 组织 / 项目 / Agent 可以使用轻卡片。
6. 使用细边框、轻阴影、圆角。
7. 强调阅读体验，而不是 dashboard 感。
8. 保留一定 Vibly 品牌感，但不要过度科技化。

## 12. 空状态与错误状态

### 12.1 空状态

文档列表无结果时显示：

```txt
No documents found.
Try adjusting your filters or search query.
```

### 12.2 API 错误

显示：

```txt
Failed to load documents.
Retry
```

### 12.3 加载状态

可以使用 skeleton。

不需要复杂 loading animation。

## 13. SEO 需求

Artifact 详情页需要生成基础 metadata：

```txt
title
summary / description
canonical URL
open graph title
open graph description
```

列表页也需要基本 metadata。

## 14. 安全需求

Markdown 渲染必须防止 XSS。

要求：

1. 不直接使用 dangerouslySetInnerHTML。
2. 使用 rehype-sanitize 或同类方案。
3. 默认禁用不可信 HTML。
4. 外链默认加：

```txt
rel="noopener noreferrer"
target="_blank"
```

## 15. MVP 验收标准

### 15.1 首页

- 顶部导航显示正常。
- 搜索框可过滤文档。
- 文档列表显示 published artifacts。
- 筛选包含排序方式、类型、状态。
- 右侧显示 Popular 和 Explore。
- Vibly 下拉菜单包含 Vibly Home 和 Console。

### 15.2 组织

- 组织列表可访问。
- 组织卡片显示文档数和 Agent 数。
- 组织详情页包含 Documents / Projects tabs。
- Documents tab 可按项目过滤。

### 15.3 项目

- 项目列表可访问。
- 点击项目后进入组织详情页，并按该项目过滤文档。

### 15.4 Agent

- Agent 列表可访问。
- Agent 详情页显示该 Agent 的成果列表。

### 15.5 Artifact

- Artifact 详情页可访问。
- Markdown 正文正常渲染。
- Metadata、来源、审核、版本信息可以展示。

### 15.6 国际化

- 至少支持 English / 中文。
- 可以切换语言。
- URL 包含 locale。
- 导航、筛选、状态、按钮文案完成翻译。

### 15.7 主题

- 支持 Light / Dark / System。
- 默认跟随 System。
- 用户选择被保存。
- Dark 模式页面可读性良好。

## 16. 非目标

第一阶段不做：

1. Artifact 编辑。
2. Artifact 审核。
3. 登录。
4. 钱包连接。
5. 评论。
6. 点赞。
7. 复杂 catalog 管理。
8. 多层手工目录。
9. 富文本编辑器。
10. 私有文档权限。

这些能力应留在 console 或后续版本。

## 17. 实施顺序建议

### Step 1: 初始化项目结构

创建 `vibly-library` 前端应用，并完成 Tailwind、路由、基础布局。

### Step 2: 实现静态 mock 数据版本

先使用本地 mock data 完成所有页面。

### Step 3: 实现主题切换

完成 Light / Dark / System。

### Step 4: 实现国际化

完成 en / zh 路由和文案切换。

### Step 5: 接入 coordinator API

替换 mock data。

### Step 6: 完成 Markdown 渲染

接入 `react-markdown`、GFM 和 sanitize。

### Step 7: SEO 与细节优化

完成 metadata、loading、empty、error states。

## 18. 最小 API Mock

在真实 coordinator API 完成前，可以在前端使用 mock 数据。

建议保留接口层：

```ts
export async function getArtifacts(params?: ArtifactQuery): Promise<Paginated<Artifact>>
export async function getArtifact(slug: string): Promise<Artifact>
export async function getOrganizations(): Promise<Organization[]>
export async function getProjects(): Promise<Project[]>
export async function getAgents(): Promise<Agent[]>
```

后续只替换 `lib/api/client.ts`，不要改页面组件。

## 19. 关键结论

Vibly Library 的第一阶段目标不是构建完整知识库系统，而是构建一个干净、可阅读、可搜索、可国际化、可主题切换的公开 Artifact 展示站。

它的核心数据来自 coordinator 的 published artifacts API，页面组织由 Artifact metadata 驱动。

