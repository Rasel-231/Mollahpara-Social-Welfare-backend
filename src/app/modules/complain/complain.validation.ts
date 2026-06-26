import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email().optional(),
    village: z.string().min(1, 'Village is required'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
    userId: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    village: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    status: z.string().optional(),
    userId: z.string().optional(),
  }),
});

export const ComplainValidation = { create, update };