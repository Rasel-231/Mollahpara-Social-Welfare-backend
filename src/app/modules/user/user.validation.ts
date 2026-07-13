import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().nonempty({ message: 'Name is required' }),
    email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z.string().nonempty({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
    phone: z.string().optional(),
    designation: z.string().optional(),
    image: z.string().optional(),
    bloodGroup: z.string().optional(),
    memberType: z.string().optional(),
    nid: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
    designation: z.string().optional(),
    image: z.string().optional(),
    bloodGroup: z.string().optional(),
    memberType: z.string().optional(),
    nid: z.string().optional(),
  }),
});

const changeRole = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'MEMBER', 'MODERATOR'], { message: 'Role must be ADMIN, MEMBER, or MODERATOR' }),
  }),
});

export const UserValidation = {
  create,
  update,
  changeRole,
};
