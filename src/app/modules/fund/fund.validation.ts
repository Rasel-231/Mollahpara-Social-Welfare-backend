import { z } from 'zod';
import { PaymentMethod, DonationPurpose, DonationStatus } from '@prisma/client';

// মূল স্কিমা (Create)
const create = z.object({
  body: z.object({
    donorName: z.string().min(1, 'Donor name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    amount: z.preprocess((val) => Number(val), z.number().positive('Amount must be > 0')),
    paymentMethod: z.nativeEnum(PaymentMethod, { error: 'Payment method is required' }),
    transactionId: z.string().min(5, 'Invalid Transaction ID'),
    purpose: z.nativeEnum(DonationPurpose).optional(),
    message: z.string().optional(),
    status: z.nativeEnum(DonationStatus).optional(),
    memberId: z.string().uuid('Invalid member id').optional(),
  }),
});

// Update স্কিমা: Create এর সকল ফিল্ডকে অটোমেটিক অপশনাল করে দেয়
const update = z.object({
  body: create.shape.body.partial(),
});

// Status আপডেট করার জন্য আলাদা স্কিমা
const updateStatus = z.object({
  body: z.object({
    status: z.nativeEnum(DonationStatus, { error: 'Status is required' }),
  }),
});

export const fundValidation = {
  create,
  update,
  updateStatus,
};