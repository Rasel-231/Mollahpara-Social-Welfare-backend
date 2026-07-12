import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    label: z.string().min(1, 'Label is required').max(200),
    icon: z.string().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    label: z.string().min(1).max(200).optional(),
    icon: z.string().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const GalleryCategoryValidation = { create, update };
