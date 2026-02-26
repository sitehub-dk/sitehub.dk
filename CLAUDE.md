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
| Fonts | Self-hosted Montserrat (woff2, weights 100-900) |
| Content | Template-per-page architecture + MDX fallback |
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
| `src/templates/` | Page-specific layout templates (9 templates) |
| `src/templates/index.ts` | Slug → template name routing map |
| `src/content/data/` | TypeScript content data modules per page (9 files) |
| `src/content/pages/{da,en,nn,sv,nl}/` | MDX page content (routing + SEO metadata) |
| `src/content.config.ts` | Content collection schema (Zod validation) |
| `src/components/` | Shared Astro components (13 components) |
| `src/components/PageRenderer.astro` | Template router with MDX prose fallback |
| `src/layouts/BaseLayout.astro` | Base layout with SEO, hreflang, JSON-LD |
| `src/pages/[...slug].astro` | Danish routes (no URL prefix) |
| `src/pages/{en,nn,sv,nl}/[...slug].astro` | Locale-prefixed routes |
| `src/i18n/` | UI string translations (264 keys × 5 langs) |
| `src/styles/global.css` | Tailwind theme + brand tokens + @font-face |
| `src/assets/images/` | 92 original images from WordPress mirror |
| `src/assets/icons/` | 19 SVG icons |
| `src/assets/fonts/` | 10 Montserrat woff2 font files |
| `tools/extract/` | WordPress REST API extraction tool |
| `public/CNAME` | GitHub Pages custom domain |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

## Template Architecture

The site uses a **template-per-page** pattern. Each unique page design has its own Astro template component (`src/templates/*Template.astro`) that hardcodes the section layout matching the original WordPress/Elementor site. Content text is loaded from TypeScript data modules (`src/content/data/*.ts`), keyed by language.

**Rendering flow:**
1. `PageRenderer.astro` receives a page from the content collection
2. `getTemplateName(slug, lang)` looks up the template in `src/templates/index.ts`
3. If a template exists → renders the structured template component
4. If no template → falls back to rendering MDX body as prose (cookie policy, news, etc.)

**Templates:** Home, About, Tech, Service, Construction, Consultancy, Compliance, Projects, Contact

**Shared components:** HeroSection, ContentSection, StatsBar, Button, IconList, FeatureIcon, TeamCard, ImageCard

### Adding a new templated page:
1. Create `src/content/data/{page}.ts` with content keyed by language
2. Create `src/templates/{Page}Template.astro` importing the data module
3. Add slug mappings for all 5 languages in `src/templates/index.ts`
4. Import and register the template in `src/components/PageRenderer.astro`
5. Create `src/content/pages/{lang}/{slug}.mdx` for routing and SEO metadata

### Adding a simple (non-templated) page:
1. Create `src/content/pages/{lang}/{slug}.mdx` for each language
2. Write content directly in MDX body — rendered as prose with HeroSection

## Content & i18n

MDX files provide routing and SEO metadata. Each has this frontmatter:

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

**Content config** lives at `src/content.config.ts` (Astro 5 convention — NOT `src/content/config.ts`).

## Brand Tokens

Defined in `src/styles/global.css` via Tailwind `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sitehub-dark` | `#133133` | Primary dark teal background |
| `--color-sitehub-darker` | `#112c2e` | Deeper background variant |
| `--color-sitehub-accent` | `#FFD4A6` | Orange accent (CTAs, highlights) |
| `--color-sitehub-accent-light` | `#FFD4A61A` | Accent section background |
| `--color-sitehub-teal` | `#00918B` | Brand teal |
| `--color-sitehub-gray` | `#62717F` | Secondary text |
| `--font-sans` | `Montserrat` | Self-hosted, weights 100-900 |
| `--spacing-section` | `128px` | Section vertical padding |
| `--radius-image` | `30px` | Image border radius |
| `--radius-button` | `100px` | Pill button radius |

**Typography:** H1: 96px→48px→30px (responsive clamp), H2: 64px→36px→26px, Body: 24px→20px→18px

**Hero gradient:** `linear-gradient(120deg, #133133E6 28.23%, #13313300 79.89%)`

**Key CSS classes:** `.btn` (pill CTA), `.btn-accent`, `.stat-card`, `.card-bordered`, `.image-rounded`

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
