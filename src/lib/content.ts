import { getCollection } from 'astro:content';
export const getPublications = async () => (await getCollection('publications', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
export const getInitiatives = async () => (await getCollection('initiatives', ({ data }) => !data.draft))
  .sort((a, b) => a.id === 'trama-legislativa' ? -1 : b.id === 'trama-legislativa' ? 1 : a.data.title.localeCompare(b.data.title, 'pt-BR'));
export const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
export const entryUrl = (section: string, id: string) => `/${section}/${id.split('/').map(encodeURIComponent).join('/')}/`;
