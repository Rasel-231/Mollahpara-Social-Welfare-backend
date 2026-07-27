import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    description: z.string().optional(),
    date: z.string({ message: 'Date is required' }).datetime(),
    location: z.string().optional(),
    image: z.string().optional(),
    createdBy: z.string({ message: 'Creator ID is required' }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    location: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const UpcomingEventValidation = { create, update };
