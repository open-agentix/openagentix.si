import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  legal: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      updated: z.string(),
    }),
  }),
};
