/** HTML → MDX conversion with Elementor cleanup */

import TurndownService from 'turndown';
import sanitizeHtml from 'sanitize-html';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Custom rules to clean up Elementor markup
turndown.addRule('elementorWidgetWrap', {
  filter: (node) => {
    const el = node as HTMLElement;
    return (
      el.tagName === 'DIV' &&
      (el.classList?.contains('elementor-widget-wrap') ||
        el.classList?.contains('elementor-element') ||
        el.classList?.contains('elementor-widget-container') ||
        el.classList?.contains('elementor-container') ||
        el.classList?.contains('elementor-row') ||
        el.classList?.contains('elementor-column'))
    );
  },
  replacement: (_content, node) => {
    // Just pass through the content, strip the wrapper
    return turndown.turndown((node as HTMLElement).innerHTML);
  },
});

// Handle Elementor icon lists
turndown.addRule('elementorIconList', {
  filter: (node) => {
    const el = node as HTMLElement;
    return el.tagName === 'UL' && el.classList?.contains('elementor-icon-list-items') === true;
  },
  replacement: (_content, node) => {
    const items = (node as HTMLElement).querySelectorAll('.elementor-icon-list-text');
    return Array.from(items)
      .map((item) => `- ${item.textContent?.trim() ?? ''}`)
      .join('\n') + '\n';
  },
});

// Strip empty elements
turndown.addRule('emptyElements', {
  filter: (node) => {
    const el = node as HTMLElement;
    return !el.textContent?.trim() && !el.querySelector('img');
  },
  replacement: () => '',
});

/**
 * Clean Elementor HTML and convert to Markdown.
 * We use content.rendered which is pre-rendered HTML, not raw Elementor JSON.
 */
export function htmlToMarkdown(html: string): string {
  // First pass: sanitize HTML to remove Elementor noise
  const clean = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'section', 'article',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'iframe', 'video', 'source',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading'],
      a: ['href', 'title', 'target'],
      iframe: ['src', 'width', 'height', 'frameborder'],
      '*': ['class', 'id'], // keep for turndown rules
    },
    // Remove inline styles (Elementor adds tons)
    allowedStyles: {},
  });

  // Convert to markdown
  let md = turndown.turndown(clean);

  // Post-processing cleanup
  md = md
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove leftover Elementor CSS class references
    .replace(/\{\.elementor[^}]*\}/g, '')
    // Clean up image paths — make relative to site
    .replace(
      /https?:\/\/sitehub\.dk\/wp-content\/uploads\//g,
      '/assets/',
    )
    // Trim
    .trim();

  return md;
}

/**
 * Generate frontmatter YAML for a page
 */
export function generateFrontmatter(meta: {
  title: string;
  description: string;
  lang: string;
  slug: string;
  translations: Record<string, string>;
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage?: string;
    canonical: string;
    noindex: boolean;
  };
  featuredImage?: string;
  wpId: number;
}): string {
  const lines: string[] = ['---'];
  lines.push(`title: "${meta.title.replace(/"/g, '\\"')}"`);
  lines.push(`description: "${meta.description.replace(/"/g, '\\"')}"`);
  lines.push(`lang: ${meta.lang}`);
  lines.push(`slug: ${meta.slug}`);

  if (Object.keys(meta.translations).length > 0) {
    lines.push('translations:');
    for (const [lang, slug] of Object.entries(meta.translations)) {
      lines.push(`  ${lang}: ${slug}`);
    }
  }

  lines.push('seo:');
  lines.push(`  title: "${meta.seo.title.replace(/"/g, '\\"')}"`);
  lines.push(`  description: "${meta.seo.description.replace(/"/g, '\\"')}"`);
  if (meta.seo.ogImage) {
    lines.push(`  ogImage: "${meta.seo.ogImage}"`);
  }
  if (meta.seo.noindex) {
    lines.push('  noindex: true');
  }

  if (meta.featuredImage) {
    lines.push(`featuredImage: "${meta.featuredImage}"`);
  }

  lines.push(`wpId: ${meta.wpId}`);
  lines.push('---');
  return lines.join('\n');
}
