# Astro 5 Content Collections — Deep Reference

## Config File Location

`src/content.config.ts` (moved from `src/content/config.ts` in v5).

## Defining Collections

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    featured: z.boolean().optional().default(false),
    thumbnail: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// JSON/YAML source
const testimonials = defineCollection({
  loader: file('src/data/testimonials.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    quote: z.string(),
  }),
});

export const collections = { projects, testimonials };
```

## Built-in Loaders

| Loader | Source | ID Generation |
|--------|--------|---------------|
| `glob({ pattern, base })` | Files matching glob pattern | Filename without extension |
| `file(path)` | Single JSON/YAML/TOML file | Auto-generated or specify `id` field |

## Querying Collections

```typescript
import { getCollection, getEntry, render } from 'astro:content';

// All entries
const allProjects = await getCollection('projects');

// Filtered
const published = await getCollection('projects', ({ data }) => !data.draft);

// Single entry by ID
const project = await getEntry('projects', 'campus-201');

// Render markdown/MDX body
const { Content, headings } = await render(project);
```

## Cross-Collection References

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: reference('authors'),  // references another collection
  }),
});
```

Resolve with `getEntry()`:

```astro
---
const { data } = Astro.props.post;
const author = await getEntry(data.author);
---
<p>By {author.data.name}</p>
```

## Generating Routes from Collections

```astro
---
// src/pages/work/[slug].astro
import { getCollection, render } from 'astro:content';
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    params: { slug: project.id },
    props: { project },
  }));
}

type Props = { project: CollectionEntry<'projects'> };
const { project } = Astro.props;
const { Content } = await render(project);
---
<CaseStudyLayout title={project.data.title}>
  <Content />
</CaseStudyLayout>
```

## Type Safety

```typescript
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'projects'>;
}
```

## Pagination

```astro
---
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('projects');
  return paginate(posts, { pageSize: 10 });
}
const { page } = Astro.props;
// page.data, page.currentPage, page.lastPage, page.url.next, page.url.prev
---
```

## Key v5 Migration Notes

| v4 | v5 |
|----|-----|
| `src/content/config.ts` | `src/content.config.ts` |
| `entry.slug` | `entry.id` |
| `const { Content } = await entry.render()` | `import { render } from 'astro:content'; const { Content } = await render(entry)` |
| No loader needed | `loader` property required (`glob()` or `file()`) |
| `compiledContent()` sync | `compiledContent()` async |
