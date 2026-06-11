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
ARG COORDINATOR_URL
ENV NEXT_PUBLIC_COORDINATOR_URL=$NEXT_PUBLIC_COORDINATOR_URL
ENV COORDINATOR_URL=$COORDINATOR_URL

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
ARG COORDINATOR_URL
ENV NEXT_PUBLIC_COORDINATOR_URL=$NEXT_PUBLIC_COORDINATOR_URL
ENV COORDINATOR_URL=$COORDINATOR_URL

RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/messages ./messages
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
