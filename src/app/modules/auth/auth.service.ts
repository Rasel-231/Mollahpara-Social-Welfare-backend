import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../../../shared/sendEmail';
import {
  IAuthResponse,
  IChangePasswordPayload,
  ILoginPayload,
  IRefreshTokenResponse,
} from './auth.interface';
import { prisma } from '../../../shared/prisma';
import config from '../../../config';
import AppError from '../../../errors/AppError';

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const signAccessToken = (user: {
  id: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret,
    {
      expiresIn: config.jwt.jwt_expires_in as jwt.SignOptions['expiresIn'],
    }
  );
};

const cleanupExpiredTokens = (memberId: string): Promise<unknown> => {
  return prisma.refreshToken.deleteMany({
    where: { memberId, expiresAt: { lt: new Date() } },
  });
};

const loginMember = async (payload: ILoginPayload): Promise<IAuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  if (!user?.password) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // if (!user.isActive) {
  //   throw new AppError(
  //     401,
  //     'Your account is not active yet. Please wait for admin approval.'
  //   );
  // }

  const accessToken = signAccessToken(user);

  const refreshTokenValue = crypto.randomBytes(40).toString('hex');
  const hashedToken = hashToken(refreshTokenValue);
  const expiresAt = new Date(Date.now() + config.jwt.refresh_token_max_age);

  await cleanupExpiredTokens(user.id);

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      memberId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    member: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (
  refreshTokenValue: string
): Promise<IRefreshTokenResponse> => {
  const hashedToken = hashToken(refreshTokenValue);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: {
      member: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!storedToken) {
    // Token not found: either invalid, or already-rotated (potential reuse/theft).
    throw new AppError(401, 'Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError(401, 'Refresh token has expired');
  }

  if (!storedToken.member.isActive) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError(401, 'Your account is not active');
  }

  // Rotate: delete the used token, issue a new one.
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const newRefreshTokenValue = crypto.randomBytes(40).toString('hex');
  const newHashedToken = hashToken(newRefreshTokenValue);
  const expiresAt = new Date(Date.now() + config.jwt.refresh_token_max_age);

  await prisma.refreshToken.create({
    data: {
      token: newHashedToken,
      memberId: storedToken.member.id,
      expiresAt,
    },
  });

  const accessToken = signAccessToken(storedToken.member);

  return { accessToken, refreshToken: newRefreshTokenValue };
};

const logout = async (refreshTokenValue: string): Promise<void> => {
  const hashedToken = hashToken(refreshTokenValue);
  await prisma.refreshToken.deleteMany({
    where: { token: hashedToken },
  });
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(
    payload.currentPassword,
    user.password ?? ''
  );

  if (!isPasswordValid) {
    throw new AppError(401, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    config.salt_round
  );

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Invalidate every existing session for this user — a leaked refresh
  // token from before the password change should stop working.
  await prisma.refreshToken.deleteMany({ where: { memberId: userId } });
};

const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + config.reset_token_max_age);

  await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      token: hashedResetToken,
      expiresAt,
    },
  });

  const resetUrl = `${config.frontend_url}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    html: `
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire shortly.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const hashedToken = hashToken(token);

  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetTokenRecord) {
    throw new AppError(401, 'Invalid or expired reset token');
  }

  if (resetTokenRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });
    throw new AppError(401, 'Reset token has expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, config.salt_round);

  const updatedUser = await prisma.user.update({
    where: { email: resetTokenRecord.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetTokenRecord.id },
  });

  // Invalidate every existing session — anyone using an old refresh token
  // (including a potential attacker who caused the reset) is logged out.
  await prisma.refreshToken.deleteMany({ where: { memberId: updatedUser.id } });
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      village: true,
      image: true,
      designation: true,
      bloodGroup: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const AuthService = {
  loginMember,
  refreshAccessToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getMyProfile,
};
