/**
 * Maps page slugs to template names.
 * Templates are dynamically imported by the route files.
 *
 * Each unique page design has its own template.
 * Pages that share the same layout (e.g. all language versions of "about")
 * use the same template — the template reads language-specific content
 * from the content data modules.
 */

// Map Danish slugs to template names
const daTemplateMap: Record<string, string> = {
  'home': 'home',
  'om-os': 'about',
  'teknologi': 'tech',
  'service': 'service',
  'bedre-byggeplads': 'construction',
  'raadgivning': 'consultancy',
  'data-og-compliance': 'compliance',
  'projekter': 'projects',
  'kontakt': 'contact',
};

// Map English slugs to template names
const enTemplateMap: Record<string, string> = {
  'home-en': 'home',
  'about': 'about',
  'technology': 'tech',
  'services': 'service',
  'better-construction-site': 'construction',
  'consultancy': 'consultancy',
  'compliance': 'compliance',
  'projects': 'projects',
  'contact': 'contact',
};

// Map Norwegian slugs
const nnTemplateMap: Record<string, string> = {
  'home-no': 'home',
  'om-oss': 'about',
  'teknologi-nn': 'tech',
  'service-nn': 'service',
  'bedre-byggeplass': 'construction',
  'radgivning': 'consultancy',
  'compliance-nn': 'compliance',
  'prosjekter': 'projects',
  'kontakt-oss': 'contact',
};

// Map Swedish slugs
const svTemplateMap: Record<string, string> = {
  'home-sv': 'home',
  'om-oss-sv': 'about',
  'teknologi-sv': 'tech',
  'service-sv': 'service',
  'battre-byggplats': 'construction',
  'radgivning-sv': 'consultancy',
  'compliance-sv': 'compliance',
  'projekt': 'projects',
  'kontakta-oss': 'contact',
};

// Map Dutch slugs
const nlTemplateMap: Record<string, string> = {
  'home-nl': 'home',
  'over-ons': 'about',
  'technologie': 'tech',
  'service-nl': 'service',
  'better-construction-site-nl': 'construction',
  'advies': 'consultancy',
  'compliance-nl': 'compliance',
  'projecten': 'projects',
  'contact-ons': 'contact',
};

const templateMaps: Record<string, Record<string, string>> = {
  da: daTemplateMap,
  en: enTemplateMap,
  nn: nnTemplateMap,
  sv: svTemplateMap,
  nl: nlTemplateMap,
};

/**
 * Get the template name for a given slug and language.
 * Returns undefined if no specific template exists (falls back to simple).
 */
export function getTemplateName(slug: string, lang: string): string | undefined {
  return templateMaps[lang]?.[slug];
}
