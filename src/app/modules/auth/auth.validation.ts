import { z } from 'zod';

const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const login = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z.string({ message: 'Password is required' }),
  }),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string({
      message: 'Current password is required',
    }),
    newPassword: passwordSchema,
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email(),
  }),
});

const resetPassword = z.object({
  body: z.object({
    token: z.string({ message: 'Reset token is required' }),
    newPassword: passwordSchema,
  }),
});

export const AuthValidation = {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
