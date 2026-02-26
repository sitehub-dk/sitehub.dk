# sitehub.dk

Static corporate website for [SiteHub ApS](https://sitehub.dk) — Danish construction tech company specializing in construction site logistics, safety, and data-driven operations.

Built with [Astro 5](https://astro.build), hosted on [GitHub Pages](https://pages.github.com/).

## Live Site

- **Staging:** https://test.sitehub.cloud
- **Production:** https://sitehub.dk *(pending DNS cutover)*

## Tech Stack

- **Astro 5** — Static site generator with zero-JS output
- **Tailwind CSS 4** — Utility-first styling via Vite plugin
- **Self-hosted Montserrat** — woff2 fonts (weights 100-900)
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
├── assets/
│   ├── images/          # 92 original images from WordPress
│   ├── icons/           # 19 SVG icons
│   ├── fonts/           # 10 Montserrat woff2 files
│   └── logo.svg
├── components/          # Shared Astro components
│   ├── Header.astro     # Sticky dark nav, 10 items, language switcher
│   ├── Footer.astro     # 3-column footer
│   ├── HeroSection.astro   # Full-width hero with gradient overlay
│   ├── ContentSection.astro # Two-column text + image
│   ├── StatsBar.astro      # Counter row with icon background
│   ├── Button.astro         # Pill CTA with arrow
│   ├── IconList.astro       # Checkmark bullet list
│   ├── FeatureIcon.astro    # SVG + title + description
│   ├── TeamCard.astro       # Bordered image card
│   ├── ImageCard.astro      # Rounded bordered image
│   ├── CookieBanner.astro   # GDPR cookie consent
│   └── PageRenderer.astro   # Template router with MDX fallback
├── content/
│   ├── data/            # TypeScript content data per page
│   │   ├── home.ts      # Homepage content (all 5 languages)
│   │   ├── about.ts     # About page content
│   │   ├── tech.ts      # Technology page content
│   │   └── ...          # 9 data modules total
│   └── pages/           # MDX files (routing + SEO metadata)
│       ├── da/          # Danish (12 pages)
│       ├── en/          # English (11 pages)
│       ├── nn/          # Norwegian (9 pages)
│       ├── sv/          # Swedish (9 pages)
│       └── nl/          # Dutch (9 pages)
├── i18n/                # UI string translations (264 keys × 5 langs)
├── templates/           # Page-specific layout templates
│   ├── index.ts         # Slug → template routing map
│   ├── HomeTemplate.astro
│   ├── AboutTemplate.astro
│   ├── TechTemplate.astro
│   └── ...              # 9 templates total
├── layouts/
│   └── BaseLayout.astro # SEO head, hreflang, JSON-LD
├── pages/               # Astro file-based routing
│   ├── [...slug].astro  # Danish routes (no prefix)
│   ├── en/[...slug].astro
│   ├── nn/[...slug].astro
│   ├── sv/[...slug].astro
│   ├── nl/[...slug].astro
│   └── 404.astro
└── styles/
    └── global.css       # Tailwind theme + brand tokens + font-face
tools/
└── extract/             # WordPress content extraction tool
```

## Architecture

The site uses a **template-per-page** architecture. Each unique page design has its own Astro template component that hardcodes the exact section layout from the original WordPress/Elementor site. Content text is loaded from TypeScript data modules (`src/content/data/*.ts`), keyed by language.

**Rendering flow:** `PageRenderer.astro` maps the page slug to a template via `src/templates/index.ts`. If a template exists, it renders the structured template. Otherwise, it falls back to rendering the MDX body as prose (used for cookie policy, news articles, etc.).

### Pages and Templates

| Page | Template | Sections |
|------|----------|----------|
| Homepage | `HomeTemplate` | Hero, StatsBar, 5 alternating ContentSections |
| About | `AboutTemplate` | Hero, intro, services CTA, team grid, ambition/mission/DNA |
| Technology | `TechTemplate` | Hero, 6 FeatureIcon grid, 6 detailed sections |
| Service | `ServiceTemplate` | Hero, intro stat, logistics, warehouse, site ops, waste |
| Construction | `ConstructionTemplate` | Hero, stats, 4 position cards, CEO quote |
| Consultancy | `ConsultancyTemplate` | Hero, 7 service sections |
| Compliance | `ComplianceTemplate` | Hero, ESG badges, DGNB/LCA/LEED/BREEAM, dashboards |
| Projects | `ProjectsTemplate` | Hero, 5 project cards with images |
| Contact | `ContactTemplate` | Hero, phone directory, contact form |

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

This site was rebuilt 1:1 from a wget mirror of the original WordPress site (Elementor Pro + Polylang + Yoast SEO). The original extraction tool (`tools/extract/`) pulled content via the WordPress REST API. The visual rebuild used the mirror HTML/CSS as reference to match layout, typography, colors, and spacing.

## License

Copyright SiteHub ApS. All rights reserved.
