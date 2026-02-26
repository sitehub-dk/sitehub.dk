# sitehub.dk

Static corporate website for [SiteHub ApS](https://sitehub.dk) — Danish construction tech company specializing in construction site logistics, safety, and data-driven operations.

Built with [Astro 5](https://astro.build), hosted on [GitHub Pages](https://pages.github.com/).

## Live Site

- **Staging:** https://test.sitehub.cloud
- **Production:** https://sitehub.dk *(pending DNS cutover)*

## Tech Stack

- **Astro 5** — Static site generator with zero-JS output
- **Tailwind CSS 4** — Utility-first styling via Vite plugin
- **MDX** — Content authored in Markdown with component support
- **5 languages** — Danish (default), English, Norwegian, Swedish, Dutch
- **GitHub Actions** — Automated build and deploy on push to `main`

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

Requires Node.js 22+ and pnpm 9+.

## Project Structure

```
src/
├── assets/              # Images, logos, icons, banners
├── components/          # Astro components
│   ├── Header.astro     # Navigation + language switcher
│   ├── Footer.astro     # Site footer
│   ├── Hero.astro       # Hero section
│   ├── Section.astro    # Content section
│   ├── CookieBanner.astro
│   ├── LanguageSwitcher.astro
│   └── PageRenderer.astro
├── content/
│   └── pages/           # MDX content files
│       ├── da/          # Danish (12 pages)
│       ├── en/          # English (11 pages)
│       ├── nn/          # Norwegian (9 pages)
│       ├── sv/          # Swedish (9 pages)
│       └── nl/          # Dutch (9 pages)
├── i18n/                # UI string translations
├── layouts/
│   └── BaseLayout.astro # Base layout with SEO
├── pages/               # Astro file-based routing
│   ├── [...slug].astro  # Danish routes (no prefix)
│   ├── en/[...slug].astro
│   ├── nn/[...slug].astro
│   ├── sv/[...slug].astro
│   ├── nl/[...slug].astro
│   └── 404.astro
└── styles/
    └── global.css       # Tailwind + brand tokens
tools/
└── extract/             # WordPress content extraction tool
```

## Content

Pages are MDX files with frontmatter for metadata, SEO, and translation links:

```yaml
---
title: "Om os"
lang: da
slug: om-os
translations:
  en: about
  nn: om-oss
  sv: om-oss-sv
  nl: over-ons
seo:
  title: "Om os - SiteHub"
  description: "Meta description for search engines"
wpId: 1113
---
```

Content was extracted from the original WordPress site (Elementor Pro + Polylang + Yoast SEO) using the tool in `tools/extract/`.

## i18n Routing

| Language | URL pattern | Example |
|----------|------------|---------|
| Danish (default) | `/{slug}/` | `/om-os/` |
| English | `/en/{slug}/` | `/en/about/` |
| Norwegian | `/nn/{slug}/` | `/nn/om-oss/` |
| Swedish | `/sv/{slug}/` | `/sv/om-oss-sv/` |
| Dutch | `/nl/{slug}/` | `/nl/over-ons/` |

## Deployment

Automated via GitHub Actions. Push to `main` triggers build and deploy to GitHub Pages.

Custom domain configured via `public/CNAME` and Hetzner DNS CNAME record.

## Migration from WordPress

This site was migrated from WordPress + Elementor Pro. The extraction tool (`tools/extract/`) pulls content via the WordPress REST API and converts it to MDX files with preserved SEO metadata from Yoast.

## License

Copyright SiteHub ApS. All rights reserved.
