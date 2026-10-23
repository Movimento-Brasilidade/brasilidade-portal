import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const image = z.string().regex(/^\/uploads\/[^\s]+$/, 'Use uma imagem em /uploads/').optional().or(z.literal(''));
const link = z.string().url().refine(v => /^https?:\/\//.test(v), 'Use HTTP(S)');
const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publicacoes' }),
  schema: z.object({
    title: z.string().min(1), description: z.string().min(1),
    date: z.coerce.date(), author: z.string().min(1),
    draft: z.boolean().default(true), tags: z.array(z.string()).default([]),
    image, imageAlt: z.string().default(''),
  }).refine(d => !d.image || d.imageAlt.trim().length > 0, 'Imagem de capa exige texto alternativo'),
});
const initiatives = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/iniciativas' }),
  schema: z.object({
    title: z.string().min(1), description: z.string().min(1),
    status: z.enum(['Em apresentação', 'Em desenvolvimento', 'Em atividade', 'Concluída']),
    draft: z.boolean().default(true), image, imageAlt: z.string().default(''),
    links: z.array(z.object({ label: z.string().min(1), url: link })).default([]),
  }).refine(d => !d.image || d.imageAlt.trim().length > 0, 'Imagem exige texto alternativo'),
});
const institutional = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/institucional' }),
  schema: z.object({ title: z.string(), description: z.string(), provisional: z.boolean().default(true) }),
});
export const collections = { publications, initiatives, institutional };
