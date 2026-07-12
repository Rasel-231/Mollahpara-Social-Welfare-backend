import { z } from 'zod';

const create = z.object({
  body: z.object({
    projectName: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    costing: z.preprocess((val) => Number(val), z.number().positive('Costing must be greater than 0')),
  }),
});

const update = z.object({
  body: create.shape.body.partial(),
});

export const costingValidation = { create, update };
