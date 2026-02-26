#!/usr/bin/env tsx
/**
 * WordPress → MDX extraction tool for sitehub.dk
 *
 * Pulls all pages, media, SEO metadata, and language mappings
 * from the WordPress REST API and converts to Astro-ready MDX files.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import ora from 'ora';
import pLimit from 'p-limit';
import { fetchAll, fetchOne, downloadFile } from './api.js';
import { htmlToMarkdown, generateFrontmatter } from './transform.js';
import type { WPPage, WPMedia, WPLanguage, SiteMap, ExtractedPage } from './types.js';

const OUT_DIR = join(import.meta.dirname, '..', '..', '..', 'extracted');
const PAGES_DIR = join(OUT_DIR, 'pages');
const MEDIA_DIR = join(OUT_DIR, 'media');

const limit = pLimit(5); // max 5 concurrent requests

async function main() {
  console.log('\n🔍 SiteHub.dk WordPress Extraction\n');

  // Step 1: Fetch languages
  const spinner = ora('Fetching languages...').start();
  let languages: WPLanguage[];
  try {
    languages = await fetchOne<WPLanguage[]>('/pll/v1/languages');
    spinner.succeed(`Found ${languages.length} languages: ${languages.map((l) => l.slug).join(', ')}`);
  } catch {
    // Fallback if Polylang API isn't public
    spinner.warn('Polylang API not accessible, using known language list');
    languages = [
      { slug: 'da', name: 'Dansk', locale: 'da_DK', flag_url: '', is_default: true },
      { slug: 'en', name: 'English', locale: 'en_US', flag_url: '', is_default: false },
      { slug: 'nn', name: 'Norsk', locale: 'nn_NO', flag_url: '', is_default: false },
      { slug: 'sv', name: 'Svenska', locale: 'sv_SE', flag_url: '', is_default: false },
      { slug: 'nl', name: 'Nederlands', locale: 'nl_NL', flag_url: '', is_default: false },
    ];
  }

  // Step 2: Fetch all pages (single request — Polylang ?lang= filter doesn't restrict properly)
  const spinner2 = ora('Fetching pages...').start();
  const allPages = await fetchAll<WPPage>('/wp/v2/pages', {
    _fields: 'id,slug,title,content,excerpt,date,modified,link,parent,menu_order,featured_media,yoast_head_json,translations',
  });

  // Detect language from page URL (the only reliable source):
  // - Danish (default): sitehub.dk/slug/ (no prefix)
  // - Other langs: sitehub.dk/{lang}/slug/
  const langPrefixes = languages.filter((l) => !l.is_default).map((l) => l.slug);
  const pagesByLang: Record<string, WPPage[]> = {};
  for (const lang of languages) pagesByLang[lang.slug] = [];

  for (const page of allPages) {
    const lang = detectLangFromUrl(page.link, langPrefixes, languages);
    page.lang = lang;
    pagesByLang[lang].push(page);
  }
  spinner2.succeed(`Fetched ${allPages.length} pages across ${languages.length} languages`);

  // Step 3: Build translation map
  // We match pages by their Polylang translations field, or by slug pattern
  const spinner3 = ora('Building translation map...').start();
  const translationMap = buildTranslationMap(allPages, pagesByLang, languages);
  spinner3.succeed(`Built translation map for ${Object.keys(translationMap).length} page groups`);

  // Step 4: Convert pages to MDX
  const spinner4 = ora('Converting pages to MDX...').start();
  const extractedPages: ExtractedPage[] = [];
  await mkdir(PAGES_DIR, { recursive: true });

  for (const page of allPages) {
    const lang = page.lang!;

    const langDir = join(PAGES_DIR, lang);
    await mkdir(langDir, { recursive: true });

    const seo = extractSEO(page);
    const translations = translationMap[page.id] ?? {};
    const content = htmlToMarkdown(page.content.rendered);

    const frontmatter = generateFrontmatter({
      title: decodeEntities(page.title.rendered),
      description: seo.description,
      lang,
      slug: page.slug,
      translations,
      seo,
      wpId: page.id,
    });

    const mdx = `${frontmatter}\n\n${content}\n`;
    const filename = `${page.slug}.mdx`;
    await writeFile(join(langDir, filename), mdx, 'utf-8');

    extractedPages.push({
      id: page.id,
      slug: page.slug,
      title: decodeEntities(page.title.rendered),
      description: seo.description,
      lang,
      content,
      translations,
      seo,
      wpLink: page.link,
      modifiedDate: page.modified,
    });
  }
  spinner4.succeed(`Converted ${extractedPages.length} pages to MDX`);

  // Step 5: Fetch and download media
  const spinner5 = ora('Fetching media...').start();
  const media = await fetchAll<WPMedia>('/wp/v2/media');
  spinner5.succeed(`Found ${media.length} media items`);

  const spinner6 = ora('Downloading media...').start();
  await mkdir(MEDIA_DIR, { recursive: true });

  const mediaResults = await Promise.allSettled(
    media.map((item) =>
      limit(async () => {
        const ext = extname(new URL(item.source_url).pathname) || '.jpg';
        const filename = `${item.id}-${slugify(item.title.rendered || item.slug)}${ext}`;
        const destPath = join(MEDIA_DIR, filename);
        await downloadFile(item.source_url, destPath);
        return { ...item, localPath: filename };
      }),
    ),
  );

  const downloaded = mediaResults.filter((r) => r.status === 'fulfilled');
  const failed = mediaResults.filter((r) => r.status === 'rejected');
  spinner6.succeed(`Downloaded ${downloaded.length} media files (${failed.length} failed)`);

  if (failed.length > 0) {
    for (const f of failed) {
      if (f.status === 'rejected') console.warn(`  Failed: ${f.reason}`);
    }
  }

  // Step 6: Generate site map
  const spinner7 = ora('Generating site map...').start();
  const siteMap: SiteMap = {
    languages,
    pages: extractedPages.map((p) => ({
      slug: p.slug,
      lang: p.lang,
      title: p.title,
      translations: p.translations,
      wpId: p.id,
    })),
    media: downloaded
      .filter((r): r is PromiseFulfilledResult<WPMedia & { localPath: string }> => r.status === 'fulfilled')
      .map((r) => ({
        id: r.value.id,
        filename: r.value.localPath,
        sourceUrl: r.value.source_url,
        mimeType: r.value.mime_type,
        localPath: r.value.localPath,
      })),
  };

  await writeFile(join(OUT_DIR, 'site-map.json'), JSON.stringify(siteMap, null, 2), 'utf-8');
  spinner7.succeed('Generated site-map.json');

  // Summary
  console.log('\n✅ Extraction complete!');
  console.log(`   Pages: ${extractedPages.length}`);
  console.log(`   Media: ${downloaded.length}`);
  console.log(`   Output: ${OUT_DIR}\n`);

  // Language breakdown
  for (const lang of languages) {
    const count = extractedPages.filter((p) => p.lang === lang.slug).length;
    console.log(`   ${lang.slug}: ${count} pages`);
  }
  console.log('');
}

/**
 * Build translation map: page_id -> { lang: slug }
 * Uses the Polylang 'translations' field if available, otherwise
 * falls back to slug-pattern matching.
 */
function buildTranslationMap(
  allPages: WPPage[],
  pagesByLang: Record<string, WPPage[]>,
  languages: WPLanguage[],
): Record<number, Record<string, string>> {
  const map: Record<number, Record<string, string>> = {};
  const pageById = new Map(allPages.map((p) => [p.id, p]));

  // First try: use Polylang translations field
  for (const page of allPages) {
    if (page.translations && Object.keys(page.translations).length > 0) {
      const translations: Record<string, string> = {};
      for (const [lang, pageId] of Object.entries(page.translations)) {
        if (typeof pageId === 'number' && pageId !== page.id) {
          const translated = pageById.get(pageId);
          if (translated) {
            translations[lang] = translated.slug;
          }
        }
      }
      if (Object.keys(translations).length > 0) {
        map[page.id] = translations;
      }
    }
  }

  // Fallback: match by known slug patterns
  if (Object.keys(map).length === 0) {
    console.log('  Using slug-pattern fallback for translation mapping');
    const knownGroups: Record<string, Record<string, string>> = {
      home: { da: 'home', en: 'home', nn: 'home-no', sv: 'home-sv', nl: 'home-nl' },
      about: { da: 'om-os', en: 'about', nn: 'om-oss', sv: 'om-oss-sv', nl: 'over-ons' },
      'better-construction-site': { da: 'bedre-byggeplads', en: 'better-construction-site', nn: 'bedre-byggeplass', sv: 'battre-byggplats', nl: 'better-construction-site-nl' },
      consultancy: { da: 'raadgivning', en: 'consultancy', nn: 'radgivning', sv: 'radgivning-sv', nl: 'advies' },
      services: { da: 'service', en: 'services', nn: 'service-nn', sv: 'service-sv', nl: 'service-nl' },
      compliance: { da: 'data-og-compliance', en: 'compliance', nn: 'compliance-nn', sv: 'compliance-sv', nl: 'compliance-nl' },
      technology: { da: 'teknologi', en: 'technology', nn: 'teknologi-nn', sv: 'teknologi-sv', nl: 'technologie' },
      projects: { da: 'projekter', en: 'projects', nn: 'prosjekter', sv: 'projekt', nl: 'projecten' },
      contact: { da: 'kontakt', en: 'contact', nn: 'kontakt-oss', sv: 'kontakta-oss', nl: 'contact-ons' },
    };

    // Build slug-to-page lookup
    const slugToPage = new Map<string, WPPage>();
    for (const page of allPages) {
      slugToPage.set(page.slug, page);
    }

    for (const group of Object.values(knownGroups)) {
      for (const [pageLang, pageSlug] of Object.entries(group)) {
        const page = slugToPage.get(pageSlug);
        if (!page) continue;

        const translations: Record<string, string> = {};
        for (const [lang, slug] of Object.entries(group)) {
          if (lang !== pageLang) {
            translations[lang] = slug;
          }
        }
        map[page.id] = translations;
      }
    }
  }

  return map;
}

/**
 * Detect language from page URL.
 * Danish (default) pages: sitehub.dk/slug/
 * Other languages: sitehub.dk/{lang}/slug/
 */
function detectLangFromUrl(
  link: string,
  langPrefixes: string[],
  languages: WPLanguage[],
): string {
  try {
    const path = new URL(link).pathname;
    for (const prefix of langPrefixes) {
      if (path.startsWith(`/${prefix}/`)) return prefix;
    }
  } catch { /* ignore malformed URLs */ }
  // Default language (no prefix)
  return languages.find((l) => l.is_default)?.slug ?? 'da';
}

/**
 * Extract SEO metadata from Yoast head JSON
 */
function extractSEO(page: WPPage) {
  const yoast = page.yoast_head_json;
  return {
    title: yoast?.title ?? decodeEntities(page.title.rendered),
    description: yoast?.description ?? '',
    ogTitle: yoast?.og_title ?? decodeEntities(page.title.rendered),
    ogDescription: yoast?.og_description ?? '',
    ogImage: yoast?.og_image?.[0]?.url,
    canonical: yoast?.canonical ?? page.link,
    noindex: yoast?.robots?.index === 'noindex',
  };
}

function decodeEntities(str: string): string {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

main().catch((err) => {
  console.error('❌ Extraction failed:', err);
  process.exit(1);
});
