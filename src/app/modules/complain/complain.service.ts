import { prisma } from '../../../shared/prisma';
import { IComplain } from './complain.interface';


const createComplain = async (data: IComplain) => {
  return await prisma.complain.create({ data });
};

const getAllComplains = async () => {
  return await prisma.complain.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const getSingleComplain = async (id: string) => {
  const complain = await prisma.complain.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!complain) throw new Error('Complain not found');
  return complain;
};

const updateComplain = async (id: string, data: Partial<IComplain>) => {
  const existing = await prisma.complain.findUnique({ where: { id } });
  if (!existing) throw new Error('Complain not found');

  return await prisma.complain.update({
    where: { id },
    data
  });
};

const deleteComplain = async (id: string) => {
  const existing = await prisma.complain.findUnique({ where: { id } });
  if (!existing) throw new Error('Complain not found');

  return await prisma.complain.delete({ where: { id } });
};

export const ComplainService = {
  createComplain,
  getAllComplains,
  getSingleComplain,
  updateComplain,
  deleteComplain,
};