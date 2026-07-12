import { prisma } from '../../../shared/prisma';

interface IProjectFundPayload {
  title: string;
  description?: string;
  amount: number;
  raised?: number;
  category: string;
  status?: string;
}

const createFund = async (payload: IProjectFundPayload) => {
  return await prisma.fund.create({ data: payload });
};

const getAllFunds = async () => {
  return await prisma.fund.findMany({ orderBy: { createdAt: 'desc' } });
};

const getFundById = async (id: string) => {
  const fund = await prisma.fund.findUnique({ where: { id } });
  if (!fund) throw new Error('Project fund not found');
  return fund;
};

const updateFund = async (id: string, payload: Partial<IProjectFundPayload>) => {
  const existing = await prisma.fund.findUnique({ where: { id } });
  if (!existing) throw new Error('Project fund not found');
  return await prisma.fund.update({ where: { id }, data: payload });
};

const deleteFund = async (id: string) => {
  const existing = await prisma.fund.findUnique({ where: { id } });
  if (!existing) throw new Error('Project fund not found');
  return await prisma.fund.delete({ where: { id } });
};

export const ProjectFundService = { createFund, getAllFunds, getFundById, updateFund, deleteFund };
