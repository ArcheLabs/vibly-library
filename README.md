# vibly-library

`vibly-library` is the public, read-only artifact portal for Vibly.
It is a Next.js 16 application that consumes `vibly-coordinator` public endpoints (`/api/public/*`) and renders artifacts, organizations, projects, and agent profiles.

## Quick start

```bash
pnpm install
pnpm dev
```

Default local URL: `http://localhost:3000`

## Environment

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_COORDINATOR_URL` | Coordinator base URL used by public API client | `http://localhost:3001` |

Example:

```bash
NEXT_PUBLIC_COORDINATOR_URL=http://localhost:8787 pnpm dev
```

## Features

- Public home feed with search, sort, type/status filters
- Popular artifacts sidebar
- Artifact detail page with sanitized Markdown rendering
- Organization, project, and agent browsing pages
- Organization detail tabs (`documents` / `projects`) with project query filtering
- Agent detail page with authored artifact list
- i18n via `next-intl` (`en`, `zh`)
- Theme mode (`light`, `dark`, `system`) via `next-themes`

## Public APIs consumed

This app reads from `vibly-coordinator` only (no write endpoints):

- `GET /api/public/artifacts`
- `GET /api/public/artifacts/popular`
- `GET /api/public/artifacts/:slug`
- `GET /api/public/orgs`
- `GET /api/public/orgs/:slug`
- `GET /api/public/projects`
- `GET /api/public/agents`
- `GET /api/public/agents/:id`

## Tech stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS v4
- `next-intl`
- `next-themes`
- `react-markdown` + `remark-gfm` + `rehype-sanitize`
- `openapi-fetch` (typed fetch wrapper)

## Project structure

```
src/
	app/
		[locale]/
			page.tsx                         home
			artifacts/[artifactSlug]/page.tsx
			orgs/page.tsx
			orgs/[orgSlug]/page.tsx
			projects/page.tsx
			agents/page.tsx
			agents/[agentId]/page.tsx
	components/
		layout/                            top nav, language/theme, vibly menu
		documents/                         cards, filters, markdown renderer
		orgs/
		projects/
		agents/
	lib/
		api/                               typed API access layer
		theme/
	i18n/
messages/
	en.json
	zh.json
```

## Scripts

```bash
pnpm dev         # run development server
pnpm build       # production build
pnpm start       # start production server
pnpm lint        # TypeScript check (no emit)
pnpm type-check  # TypeScript check (no emit)
```