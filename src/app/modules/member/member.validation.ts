import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6),
    phone: z.string().optional(),
    role: z.string().optional(),
    designation: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
    designation: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const MemberValidation = {
  create,
  update,
};
