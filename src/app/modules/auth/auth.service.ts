import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import sendEmail from '../../../shared/sendEmail';
import {
  IAuthResponse,
  IChangePasswordPayload,
  ILoginPayload,
  IRefreshTokenResponse,
} from './auth.interface';

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateRefreshTokenValue = (): string => {
  return crypto.randomBytes(40).toString('hex');
};

const parseDurationToMs = (duration: string): number => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };
  return value * (multipliers[unit] || 86400000);
};

const loginMember = async (
  payload: ILoginPayload
): Promise<IAuthResponse> => {
  const member = await prisma.member.findUnique({
    where: { email: payload.email },
  });

  if (!member) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    member.password
  );

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign(
    { id: member.id, email: member.email, role: member.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );

  const refreshTokenValue = generateRefreshTokenValue();
  const hashedToken = hashToken(refreshTokenValue);
  const expiresAt = new Date(
    Date.now() + parseDurationToMs(config.jwt.refreshExpiresIn)
  );

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      memberId: member.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    },
  };
};

const refreshAccessToken = async (
  refreshTokenValue: string
): Promise<IRefreshTokenResponse> => {
  const hashedToken = hashToken(refreshTokenValue);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: { member: true },
  });


  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new Error('Refresh token has expired');
  }

  const accessToken = jwt.sign(
    {
      id: storedToken.member.id,
      email: storedToken.member.email,
      role: storedToken.member.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );

  return { accessToken };
};

const getProfile = async (memberId: string) => {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      image: true,
      bio: true,
      joinDate: true,
      createdAt: true,
    },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

const logout = async (refreshTokenValue: string): Promise<void> => {
  const hashedToken = hashToken(refreshTokenValue);

  await prisma.refreshToken.deleteMany({
    where: { token: hashedToken },
  });
};

const changePassword = async (
  memberId: string,
  payload: IChangePasswordPayload
): Promise<void> => {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  const isPasswordValid = await bcrypt.compare(
    payload.currentPassword,
    member.password
  );

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    config.bcryptSaltRounds
  );

  await prisma.member.update({
    where: { id: memberId },
    data: { password: hashedPassword },
  });
};

const forgotPassword = async (email: string): Promise<void> => {
  const member = await prisma.member.findUnique({
    where: { email },
  });

  if (!member) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = hashToken(resetToken);
  const expiresAt = new Date(
    Date.now() + parseDurationToMs(config.jwt.resetTokenExpiresIn)
  );

  await prisma.passwordResetToken.create({
    data: {
      email: member.email,
      token: hashedResetToken,
      expiresAt,
    },
  });

  const resetUrl = `${config.nodeEnv === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: member.email,
    subject: 'Password Reset',
    html: `
      <p>Hello ${member.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in ${config.jwt.resetTokenExpiresIn}.</p>
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
    throw new Error('Invalid or expired reset token');
  }

  if (resetTokenRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });
    throw new Error('Reset token has expired');
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcryptSaltRounds
  );

  await prisma.member.update({
    where: { email: resetTokenRecord.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetTokenRecord.id },
  });
};

export const AuthService = {
  loginMember,
  getProfile,
  refreshAccessToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
