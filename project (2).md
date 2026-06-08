
# vibly-library 部署简化实施计划

## 目标

将 `vibly-library` 从 **GitHub Pages 静态导出部署** 改为 **Cloud Run Server 模式部署**。

核心原则：

```txt
不再继续调 output: "export"
不再部署到 GitHub Pages
保留 Next.js Server/App Router 能力
使用 Cloud Run 托管 vibly-library
GitHub Action 负责 CI 和 Cloud Run 部署
```

原因：当前仓库存在动态详情页、server-side fetch、`generateMetadata()`、`next-intl middleware` 等能力，本质上不是纯静态站。详情页现在会在服务端请求 artifact/org/agent 数据。  

---

# Phase 1：移除 GitHub Pages 静态导出逻辑

## 1. 修改 `next.config.ts`

当前配置里有 GitHub Pages 条件分支：

```ts
const isGithubPages = process.env.GITHUB_PAGES === "true";
output: isGithubPages ? "export" : undefined;
basePath;
assetPrefix;
```

这些逻辑需要移除。当前文件确实包含 `GITHUB_PAGES`、`output: export`、`basePath`、`assetPrefix`。

改为：

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production",
  typedRoutes: false,

  // Use Next.js server output optimized for container deployment.
  output: "standalone",

  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
```

说明：

```txt
output: "standalone" 不是静态导出。
它仍然是 Next.js Server 模式，只是更适合 Docker / Cloud Run。
```

---

# Phase 2：删除 GitHub Pages workflow，改成 CI

## 2. 删除或重命名 `.github/workflows/pages.yml`

当前 workflow 会：

```txt
设置 GITHUB_PAGES=true
执行 pnpm build
touch out/.nojekyll
upload-pages-artifact
deploy-pages
```

这些都属于 GitHub Pages 静态部署流程。

建议改成：

```txt
.github/workflows/ci.yml
```

内容：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest

    env:
      NEXT_PUBLIC_COORDINATOR_URL: ${{ vars.NEXT_PUBLIC_COORDINATOR_URL }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Enable Corepack
        run: corepack enable

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Build
        run: pnpm build
```

删除这些 GitHub Pages 专用内容：

```yaml
pages: write
id-token: write # 如果 CI 不需要可以删除
GITHUB_PAGES: "true"
touch out/.nojekyll
actions/upload-pages-artifact
actions/deploy-pages
```

---

# Phase 3：修复 workspace 依赖问题

当前 `package.json` 里有：

```json
"@vibly/coordinator-http-contract": "workspace:*"
```



同时 `pnpm-workspace.yaml` 引用了仓库外部目录：

```yaml
- "../vibly-coordinator-http-contract"
```



这对本地开发可以，但对独立 GitHub Action / Cloud Run build 不稳定。

## 推荐修改

把 workspace 依赖改为已发布 npm 包版本。

例如，如果当前正式包名仍是：

```txt
@vibly/coordinator-http-contract
```

则改为：

```json
"@vibly/coordinator-http-contract": "^x.y.z"
```

如果项目已经迁移为：

```txt
@vibly-ai/coordinator-http-contract
```

则同步修改 import 和依赖名。

要求：

```txt
不要在独立部署仓库里保留 workspace:*。
```

然后简化 `pnpm-workspace.yaml`：

```yaml
packages:
  - "."
allowBuilds:
  '@parcel/watcher': true
  '@swc/core': true
  esbuild: true
  sharp: true
```

---

# Phase 4：新增 Dockerfile

在仓库根目录新增：

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_COORDINATOR_URL
ENV NEXT_PUBLIC_COORDINATOR_URL=$NEXT_PUBLIC_COORDINATOR_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

ARG NEXT_PUBLIC_COORDINATOR_URL
ENV NEXT_PUBLIC_COORDINATOR_URL=$NEXT_PUBLIC_COORDINATOR_URL

RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
```

注意：`NEXT_PUBLIC_COORDINATOR_URL` 会被打进前端 bundle，因此必须在 Docker build 阶段传入。

---

# Phase 5：新增 Cloud Run 部署 workflow

新增：

```txt
.github/workflows/deploy-cloud-run.yml
```

内容：

```yaml
name: Deploy Cloud Run

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

env:
  PROJECT_ID: vibly-496706
  REGION: asia-east1
  SERVICE: vibly-library
  ARTIFACT_REPOSITORY: vibly
  NEXT_PUBLIC_COORDINATOR_URL: ${{ vars.NEXT_PUBLIC_COORDINATOR_URL }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

      - name: Build image
        run: |
          IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY/$SERVICE:$GITHUB_SHA"
          echo "IMAGE=$IMAGE" >> "$GITHUB_ENV"
          docker build \
            --build-arg NEXT_PUBLIC_COORDINATOR_URL="$NEXT_PUBLIC_COORDINATOR_URL" \
            -t "$IMAGE" .

      - name: Push image
        run: docker push "$IMAGE"

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy "$SERVICE" \
            --project "$PROJECT_ID" \
            --region "$REGION" \
            --image "$IMAGE" \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars NEXT_PUBLIC_COORDINATOR_URL="$NEXT_PUBLIC_COORDINATOR_URL"
```

需要在 GitHub 配置：

```txt
Variables:
NEXT_PUBLIC_COORDINATOR_URL

Secrets:
GCP_WORKLOAD_IDENTITY_PROVIDER
GCP_SERVICE_ACCOUNT
```

如果 Artifact Registry 还没创建，需要先手动执行一次：

```bash
gcloud artifacts repositories create vibly \
  --repository-format=docker \
  --location=asia-east1 \
  --project=vibly-496706
```

---

# Phase 6：本地验证

执行：

```bash
pnpm install
pnpm type-check
NEXT_PUBLIC_COORDINATOR_URL=https://你的-coordinator-url pnpm build
```

再验证 Docker：

```bash
docker build \
  --build-arg NEXT_PUBLIC_COORDINATOR_URL=https://你的-coordinator-url \
  -t vibly-library:test .

docker run --rm -p 8080:8080 vibly-library:test
```

浏览器打开：

```txt
http://localhost:8080/en
http://localhost:8080/zh
```

---

# 验收标准

必须满足：

```txt
1. pnpm type-check 通过
2. pnpm build 通过
3. Docker build 通过
4. Docker run 后 /en 和 /zh 可访问
5. 首页可读取 artifacts
6. artifact detail 页面可访问
7. org detail 页面可访问
8. agent detail 页面可访问
9. GitHub Actions 不再出现 output: export / out/.nojekyll / deploy-pages
10. Cloud Run 部署成功并可公网访问
```

---

# 推荐提交顺序

```bash
git checkout -b chore/cloud-run-deploy
```

第一笔：

```bash
git add next.config.ts
git commit -m "chore: switch library to standalone server output"
```

第二笔：

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "chore: use published coordinator contract dependency"
```

第三笔：

```bash
git rm .github/workflows/pages.yml
git add .github/workflows/ci.yml
git commit -m "ci: replace pages deployment with build checks"
```

第四笔：

```bash
git add Dockerfile .github/workflows/deploy-cloud-run.yml
git commit -m "ci: deploy library to Cloud Run"
```

最后：

```bash
git push origin chore/cloud-run-deploy
```

---

