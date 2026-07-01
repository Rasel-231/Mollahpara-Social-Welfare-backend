import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    authorId: z.string().min(1, 'Author ID is required'),
    slug: z.string().optional(),
    image: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

export const NewsValidation = { create, update };
