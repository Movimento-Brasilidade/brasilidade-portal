import { z } from 'astro:content';
import data from '../content/site.json';
const url = z.string().url().refine(v => /^https?:\/\//.test(v)).or(z.literal(''));
export const site = z.object({
  name: z.string().min(1), description: z.string().min(1), publicUrl: url,
  instagramUrl: url, instagramLabel: z.string().min(1), instagramCta: z.string().min(1), tramaUrl: url, contactEmail: z.string().email().or(z.literal('')),
  heroTitle: z.string().min(1), heroAccent: z.string().min(1), heroText: z.string().min(1),
  aboutTitle: z.string().min(1), aboutText: z.string().min(1),
  participateText: z.string().min(1), provisional: z.boolean(),
}).parse({ ...data, description: data.heroText });
