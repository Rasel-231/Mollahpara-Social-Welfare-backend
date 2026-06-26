import { prisma } from '../../../shared/prisma';

const createFund = async (payload: any) => {
  const fund = await prisma.fund.create({ data: payload });
  return fund;
};

const getAllFunds = async () => {
  const funds = await prisma.fund.findMany({ orderBy: { createdAt: 'desc' } });
  return funds;
};

const getFundById = async (id: string) => {
  const fund = await prisma.fund.findUnique({ where: { id } });
  if (!fund) {
    throw new Error('Fund not found');
  }
  return fund;
};

const updateFund = async (id: string, payload: any) => {
  const existing = await prisma.fund.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Fund not found');
  }

  const fund = await prisma.fund.update({ where: { id }, data: payload });
  return fund;
};

const deleteFund = async (id: string) => {
  const existing = await prisma.fund.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Fund not found');
  }

  const fund = await prisma.fund.delete({ where: { id } });
  return fund;
};

export const FundService = {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund,
};