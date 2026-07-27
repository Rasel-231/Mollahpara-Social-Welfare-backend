import { z } from 'zod';

const login = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z.string({ message: 'Password is required' }),
  }),
});

const refreshToken = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

const logout = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string({
      message: 'Current password is required',
    }),
    newPassword: z
      .string({ message: 'New password is required' })
      .min(6, 'Password must be at least 6 characters'),
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
    newPassword: z
      .string({ message: 'New password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const AuthValidation = {
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
