import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    videoUrl: z.string().min(1, 'Video URL is required'),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    videoUrl: z.string().optional(),
  }),
});

export const VideoValidation = { create, update };
