// src/content.config.ts — typed schema for the Tesseract-Ops content collections.
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    dek: z.string(),
    date: z.date(),
    /** Reading time as a human label, e.g. "14m". Cheap; not auto-derived. */
    readTime: z.string(),
    tags: z.array(z.string()).default([]),
    kind: z.enum(['deep-dive', 'essay', 'changelog', 'note']),
    /** Reference into the `series` collection by slug, e.g. "building-the-lab". */
    series: reference('series').optional(),
    part: z.number().int().positive().optional(),
    /** Optional banner image — when omitted, <PostHero> renders a striped placeholder. */
    hero: image().optional(),
    heroCaption: z.string().optional(),
    /** Optional "result" chip rendered next to the title eyebrow. */
    heroWidth: z.number().optional(),
    metric: z.object({
      value: z.string(),
      label: z.string(),
    }).optional(),
    /** Hide drafts from production via `getCollection('posts', ({data}) => !data.draft)`. */
    draft: z.boolean().default(false),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/series' }),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
    total: z.number().int().positive(),
  }),
});

export const collections = { posts, series };
