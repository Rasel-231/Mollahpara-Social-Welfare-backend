import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    amount: z.number({ required_error: 'Amount is required' }),
    raised: z.number().optional(),
    category: z.string({ required_error: 'Category is required' }),
    status: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().optional(),
    raised: z.number().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const FundValidation = { create, update };
