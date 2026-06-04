import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
    image: z.string().optional(),
    authorId: z.string({ required_error: 'Author ID is required' }),
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
