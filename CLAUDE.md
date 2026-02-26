# CLAUDE.md — sitehub.dk (wp-gh)

## Project Overview

Static corporate website for SiteHub ApS, migrated from WordPress + Elementor to Astro 5.
Hosted on GitHub Pages at sitehub.dk.

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS 4
- **Content:** MDX files in content collections
- **i18n:** 5 languages — da (default), en, nn, sv, nl
- **Deployment:** GitHub Pages via GitHub Actions

## Brand Tokens

- Dark teal background: `#133133`, `#112c2e`
- Orange accent: `#ffd4a6`
- SiteHub logo: SVG in `src/assets/logos/`

## Key Directories

| Path | Purpose |
|------|---------|
| `src/content/pages/{lang}/` | MDX page content per language |
| `src/components/` | Astro components |
| `src/layouts/` | Page layouts |
| `src/i18n/` | UI string translations |
| `src/assets/` | Images, logos, icons |
| `tools/extract/` | WordPress extraction tool |

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Static build
pnpm preview      # Preview build
pnpm extract      # Run WordPress extraction
```

## Content Structure

Each page is an MDX file with frontmatter:
```yaml
title: Page Title
description: SEO description
lang: da
slug: om-os
translations:
  en: about
  nn: om-oss
  sv: om-oss-sv
  nl: over-ons
```

## Conventions

- Conventional commits: `feat:`, `fix:`, `docs:`, etc.
- pnpm as package manager
- TypeScript everywhere
