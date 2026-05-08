import { defineCollection, z } from 'astro:content';

const transactionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dateline: z.string(),
    beat: z.enum(['agentic-engineering', 'creative-pipeline', 'cushion-economics']),
    producedBy: z.string(),
    valueProp: z.string(),
    loomUrl: z.string().optional(),
    loomFrame: z.string().optional(),
    limitations: z.array(z.string()),
    shipped: z.string().optional(),
  })
});

export const collections = {
  'transactions': transactionsCollection,
};
