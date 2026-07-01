import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    lastDonationDate: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    isAvailable: z.boolean().optional().default(true),
    userId: z.string().uuid().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    bloodGroup: z.string().optional(),
    lastDonationDate: z.string().optional().nullable(),
    address: z.string().optional(),
    isAvailable: z.boolean().optional(),
    userId: z.string().uuid().optional().nullable(),
  }),
});

export const DonorValidation = {
  create,
  update,
};
