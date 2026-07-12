import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    categoryId: z.string().uuid().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    categoryId: z.string().uuid().optional().nullable(),
    image: z.string().optional(),
  }),
});

export const GalleryValidation = { create, update };
