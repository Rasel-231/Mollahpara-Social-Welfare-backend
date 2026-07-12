import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    month: z.string().min(1, 'Month is required'),
    year: z.number().int().min(2020).max(2100),
    amount: z.preprocess((val) => Number(val), z.number().positive('Amount must be > 0')),
    status: z.enum(['PAID', 'PENDING', 'OVERDUE']).optional(),
    note: z.string().optional(),
  }),
});

const update = z.object({
  body: create.shape.body.partial(),
});

export const MonthlyChandaValidation = { create, update };
