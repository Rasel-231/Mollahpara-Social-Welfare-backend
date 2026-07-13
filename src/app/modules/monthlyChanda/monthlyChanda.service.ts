import { prisma } from '../../../shared/prisma';
import AppError from '../../../errors/AppError';

interface IMonthlyChandaPayload {
  name: string;
  phone?: string;
  month: string;
  year: number;
  amount: number;
  status?: string;
  note?: string;
}

const createChanda = async (payload: IMonthlyChandaPayload) => {
  return await prisma.monthlyChanda.create({ data: payload });
};

const getAllChandas = async () => {
  return await prisma.monthlyChanda.findMany({ orderBy: { createdAt: 'desc' } });
};

const getChandaById = async (id: string) => {
  const chanda = await prisma.monthlyChanda.findUnique({ where: { id } });
  if (!chanda) throw new AppError(404, 'Monthly chanda not found');
  return chanda;
};

const updateChanda = async (id: string, payload: Partial<IMonthlyChandaPayload>) => {
  const existing = await prisma.monthlyChanda.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Monthly chanda not found');
  return await prisma.monthlyChanda.update({ where: { id }, data: payload });
};

const deleteChanda = async (id: string) => {
  const existing = await prisma.monthlyChanda.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Monthly chanda not found');
  return await prisma.monthlyChanda.delete({ where: { id } });
};

export const MonthlyChandaService = { createChanda, getAllChandas, getChandaById, updateChanda, deleteChanda };
