import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    lang: z.enum(['da', 'en', 'nn', 'sv', 'nl']),
    slug: z.string(),
    translations: z
      .record(z.string(), z.string())
      .optional()
      .default({}),
    seo: z
      .object({
        title: z.string(),
        description: z.string().default(''),
        ogImage: z.string().optional(),
        noindex: z.boolean().optional(),
      })
      .optional(),
    featuredImage: z.string().optional(),
    wpId: z.number(),
  }),
});

export const collections = { pages };
