import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().nonempty({ message: 'Name is required' }),
    phone: z.string().nonempty({ message: 'Phone is required' }),
    village: z.string().nonempty({ message: 'Village is required' }),
    designation: z.string().nonempty({ message: 'Designation is required' }),
    email: z.string().email().optional(),
    subject: z.string().nonempty({ message: 'Subject is required' }),
    message: z.string().nonempty({ message: 'Message is required' }),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    village: z.string().optional(),
    designation: z.string().optional(),
    email: z.string().email().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const ContactValidation = {
  create,
  update,
};