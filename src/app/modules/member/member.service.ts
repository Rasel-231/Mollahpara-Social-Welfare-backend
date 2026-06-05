import bcrypt from 'bcrypt';
import config from '../../../config'
import { prisma } from '../../../shared/prisma';

const createMember = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcryptSaltRounds
  );

  const member = await prisma.member.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });

  return member;
};

const getAllMembers = async () => {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });

  return members;
};

const getMemberById = async (id: string) => {
  const member = await prisma.member.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

const updateMember = async (id: string, payload: any) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, config.bcryptSaltRounds);
  }

  const member = await prisma.member.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });

  return member;
};

const deleteMember = async (id: string) => {
  const member = await prisma.member.delete({
    where: { id },
  });

  return member;
};

export const MemberService = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
