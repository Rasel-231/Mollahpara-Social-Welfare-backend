import { z } from 'zod';

const create = z.object({
  body: z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    hospitalName: z.string().min(1, 'Hospital name is required'),
    requiredDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date(),
    ),
    unitsRequired: z.number().int().positive('Must be at least 1 unit'),
    urgency: z.string().min(1, 'Urgency is required'),
    requesterId: z.string().uuid().optional(),
  }),
});

const update = z.object({
  body: z.object({
    patientName: z.string().optional(),
    bloodGroup: z.string().optional(),
    hospitalName: z.string().optional(),
    requiredDate: z.preprocess(
      (val) => (typeof val === 'string' || val instanceof Date ? new Date(val as any) : val),
      z.date().optional()
    ),
    unitsRequired: z.number().int().positive().optional(),
    urgency: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const BloodRequestValidation = {
  create,
  update,
};
