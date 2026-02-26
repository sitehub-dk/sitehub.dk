/** WordPress REST API types for sitehub.dk extraction */

export interface WPPage {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  link: string;
  parent: number;
  menu_order: number;
  featured_media: number;
  yoast_head_json?: YoastSEO;
  lang?: string;
  translations?: Record<string, number>; // lang_code -> page_id
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
  };
}

export interface YoastSEO {
  title: string;
  description: string;
  robots: {
    index: string;
    follow: string;
  };
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  og_image?: Array<{
    url: string;
    width: number;
    height: number;
    type: string;
  }>;
  twitter_card?: string;
  schema?: {
    '@graph': Array<Record<string, unknown>>;
  };
}

export interface WPMedia {
  id: number;
  slug: string;
  title: { rendered: string };
  source_url: string;
  mime_type: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
    file: string;
    sizes?: Record<string, {
      file: string;
      width: number;
      height: number;
      source_url: string;
    }>;
  };
}

export interface WPLanguage {
  slug: string;
  name: string;
  locale: string;
  flag_url: string;
  is_default: boolean;
}

export interface ExtractedPage {
  id: number;
  slug: string;
  title: string;
  description: string;
  lang: string;
  content: string; // MDX content
  translations: Record<string, string>; // lang -> slug
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
  wpLink: string;
  modifiedDate: string;
}

export interface SiteMap {
  languages: WPLanguage[];
  pages: Array<{
    slug: string;
    lang: string;
    title: string;
    translations: Record<string, string>;
    wpId: number;
  }>;
  media: Array<{
    id: number;
    filename: string;
    sourceUrl: string;
    mimeType: string;
    localPath: string;
  }>;
}
