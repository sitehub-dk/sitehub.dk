import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://test.sitehub.cloud',
  output: 'static',
  i18n: {
    locales: ['da', 'en', 'nn', 'sv', 'nl'],
    defaultLocale: 'da',
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
    fallback: {
      en: 'da',
      nn: 'da',
      sv: 'da',
      nl: 'da',
    },
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
