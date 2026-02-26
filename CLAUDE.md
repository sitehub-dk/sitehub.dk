# CLAUDE.md — sitehub.dk

## Project Overview

Static corporate website for **SiteHub ApS** (Danish construction tech), migrated from WordPress + Elementor Pro to Astro 5. Hosted on GitHub Pages with Hetzner DNS.

- **Repo:** `sitehub-dk/sitehub.dk`
- **Live:** https://test.sitehub.cloud (staging), sitehub.dk (production — not yet cutover)
- **DNS:** Hetzner Cloud DNS, zone `sitehub.cloud` (ID: 763363)
- **Origin:** Migrated from WordPress at sitehub.dk (REST API extraction)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (`output: 'static'`) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Content | MDX files in Astro Content Collections |
| i18n | 5 languages — da (default), en, nn, sv, nl |
| Deployment | GitHub Pages via GitHub Actions |
| DNS | Hetzner Cloud API (`api.hetzner.cloud/v1`) |
| Package manager | pnpm 9 |

**Important:** Do NOT use `@astrojs/tailwind` — it only supports Tailwind v3. Tailwind v4 uses the Vite plugin directly (`@tailwindcss/vite`).

## Commands

```bash
pnpm dev          # Dev server (http://localhost:4321)
pnpm build        # Static build → dist/
pnpm preview      # Preview build locally
pnpm extract      # Run WordPress extraction tool
```

## Project Structure

| Path | Purpose |
|------|---------|
| `src/content/pages/{da,en,nn,sv,nl}/` | MDX page content per language |
| `src/content.config.ts` | Content collection schema (Zod validation) |
| `src/components/` | Astro components (Header, Footer, Hero, etc.) |
| `src/layouts/BaseLayout.astro` | Base page layout with SEO head |
| `src/pages/[...slug].astro` | Danish routes (no URL prefix) |
| `src/pages/{en,nn,sv,nl}/[...slug].astro` | Locale-prefixed routes |
| `src/i18n/` | UI string translations + helper functions |
| `src/styles/global.css` | Tailwind + SiteHub brand tokens |
| `src/assets/` | Images, logos, icons, banners |
| `tools/extract/` | WordPress REST API extraction tool |
| `public/CNAME` | GitHub Pages custom domain |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

## Content & i18n

Each page is an MDX file with this frontmatter schema:

```yaml
title: "Om os"
description: "SEO description"
lang: da
slug: om-os
translations:
  en: about
  nn: om-oss
  sv: om-oss-sv
  nl: over-ons
seo:
  title: "Om os - SiteHub"
  description: "Meta description"
  ogImage: "https://..."
wpId: 1113
```

**Routing convention:**
- Danish (default locale): no prefix → `/om-os/`
- Other locales: prefixed → `/en/about/`, `/nn/om-oss/`, `/sv/om-oss-sv/`, `/nl/over-ons/`
- Homepage: `/` (da), `/en/` (en), `/nn/` (nn), etc.

**Adding a new page:**
1. Create `src/content/pages/{lang}/{slug}.mdx` for each language
2. Include `translations` map in frontmatter linking all language versions
3. Build verifies schema via Zod — missing required fields will fail the build

**Content config** lives at `src/content.config.ts` (Astro 5 convention — NOT `src/content/config.ts`).

## Brand Tokens

Defined in `src/styles/global.css` via Tailwind `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sitehub-dark` | `#133133` | Primary dark teal background |
| `--color-sitehub-darker` | `#112c2e` | Deeper background variant |
| `--color-sitehub-accent` | `#ffd4a6` | Orange accent (CTAs, highlights) |
| `--color-sitehub-teal` | `#00918B` | Brand teal |

## Deployment

Push to `main` → GitHub Actions builds and deploys automatically.

Pipeline: checkout → pnpm install → `astro build` → upload artifact → deploy to GitHub Pages.

**Custom domain:** `test.sitehub.cloud` CNAME → `sitehub-dk.github.io` (via Hetzner DNS).

## WordPress Extraction Tool

Located in `tools/extract/`. Fetches all content from the WordPress REST API at sitehub.dk.

```bash
pnpm extract    # Outputs to extracted/ directory
```

Key decisions made during extraction:
- Uses `content.rendered` (pre-rendered HTML from Elementor) — NOT raw `_elementor_data` JSON
- Language detection via URL path prefix (Polylang `?lang=` filter is broken — returns all pages)
- SEO metadata from `yoast_head_json` field on REST API responses
- `og_locale` from Yoast is unreliable (always returns `en_US`) — language detected from URL instead

## Conventions

- **Commits:** Conventional commits — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- **Package manager:** pnpm (specified in `package.json` `packageManager` field)
- **TypeScript:** Used everywhere (Astro components use TypeScript in frontmatter)
- **No direct push to main** — use feature branches + PRs
