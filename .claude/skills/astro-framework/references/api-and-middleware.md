# Astro API Endpoints & Middleware — Deep Reference

## API Endpoints

Create at `src/pages/api/[name].ts`. The file extension in the filename becomes the output format.

### Static Endpoint (prerendered at build)

```typescript
// src/pages/api/projects.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects');
  return new Response(JSON.stringify(projects.map(p => p.data)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Server Endpoint (on-demand)

```typescript
// src/pages/api/contact.ts
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  // Validate, send email, etc.
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
```

### Dynamic API Routes

```typescript
// src/pages/api/projects/[slug].json.ts
import type { APIRoute } from 'astro';

export function getStaticPaths() {
  return [
    { params: { slug: 'campus-201' } },
  ];
}

export const GET: APIRoute = ({ params }) => {
  return new Response(JSON.stringify({ slug: params.slug }));
};
```

## Middleware

File: `src/middleware.ts` (or `src/middleware/index.ts`)

```typescript
import { defineMiddleware, sequence } from 'astro:middleware';

const logging = defineMiddleware(async (context, next) => {
  console.log(`${context.request.method} ${context.url.pathname}`);
  return next();
});

const themeDetection = defineMiddleware(async (context, next) => {
  const theme = context.cookies.get('sw-theme')?.value || 'light';
  context.locals.theme = theme;
  return next();
});

export const onRequest = sequence(logging, themeDetection);
```

### Key Details

- `context.locals` stores per-request data, accessible in components via `Astro.locals`
- `next()` calls the next middleware or page handler
- Return a `Response` to short-circuit (redirects, error pages)
- `context.rewrite('/other-path')` serves different content without redirecting
- Runs at build time for prerendered pages, at request time for SSR
- `onRequest` must NOT be a default export

### Typing Locals

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    theme: 'light' | 'dark';
    user?: { id: string; name: string };
  }
}
```

Then in components: `const { theme } = Astro.locals;`

## Server Islands (Astro 5)

Defer individual components to server-render on demand:

```astro
<UserGreeting server:defer>
  <div slot="fallback" class="skeleton h-8 w-32" />
</UserGreeting>
```

The page ships immediately as static HTML; the deferred component loads asynchronously. Use for personalized or real-time content in an otherwise static page.
