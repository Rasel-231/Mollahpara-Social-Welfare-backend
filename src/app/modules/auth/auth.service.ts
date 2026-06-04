import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import { IAuthResponse, ILoginPayload } from './auth.interface';

const loginMember = async (payload: ILoginPayload): Promise<IAuthResponse> => {
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

  return {
    accessToken,
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    },
  };
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

export const AuthService = {
  loginMember,
  getProfile,
};
