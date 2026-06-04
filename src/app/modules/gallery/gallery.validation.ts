import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    image: z.string({ required_error: 'Image URL is required' }),
    description: z.string().optional(),
    category: z.string().optional(),
    uploadedBy: z.string({ required_error: 'Uploader ID is required' }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const GalleryValidation = { create, update };
