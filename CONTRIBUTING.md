# Contributing

## Development Setup

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321 to see the site.

## Adding or Editing Content

1. Edit MDX files in `src/content/pages/{lang}/`
2. Each page must exist in all 5 languages with matching `translations` in frontmatter
3. Run `pnpm build` to verify — the Zod schema catches missing or invalid frontmatter

### Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title |
| `description` | No | Short description for SEO |
| `lang` | Yes | Language code: `da`, `en`, `nn`, `sv`, `nl` |
| `slug` | Yes | URL slug (no leading slash) |
| `translations` | No | Map of lang code → slug for other versions |
| `seo.title` | No | Override for `<title>` tag |
| `seo.description` | No | Override for meta description |
| `wpId` | Yes | Original WordPress page ID |

## Commits

Use [conventional commits](https://www.conventionalcommits.org/):

- `feat:` — New feature or page
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code changes that don't add features or fix bugs
- `chore:` — Dependency updates, config changes

## Branching

- Work on feature branches, not directly on `main`
- Push to `main` triggers automatic deployment to GitHub Pages
- Use pull requests for review before merging

## Build & Preview

```bash
pnpm build       # Build static site to dist/
pnpm preview     # Serve dist/ locally for testing
```

The build must succeed before pushing — broken builds will fail deployment.
