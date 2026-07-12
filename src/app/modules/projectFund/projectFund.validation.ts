import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    amount: z.preprocess((val) => Number(val), z.number().positive('Amount must be > 0')),
    raised: z.preprocess((val) => Number(val), z.number().min(0)).optional(),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['PLANNING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

const update = z.object({
  body: create.shape.body.partial(),
});

export const ProjectFundValidation = { create, update };
