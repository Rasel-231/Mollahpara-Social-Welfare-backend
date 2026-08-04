import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

const createFund = async (payload: Prisma.TransactionCreateInput) => {
  const fund = await prisma.transaction.create({ data: payload });
  return fund;
};

const getAllFunds = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['donorName', 'phone', 'email', 'transactionId']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const funds = await prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' } });
  return funds;
};

const getFundById = async (id: string) => {
  const fund = await prisma.transaction.findUnique({ where: { id } });
  if (!fund) {
    throw new AppError(404, 'Fund not found');
  }
  return fund;
};

const updateFund = async (id: string, payload: Prisma.TransactionUpdateInput) => {
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Fund not found');
  }

  const fund = await prisma.transaction.update({ where: { id }, data: payload });
  return fund;
};

const deleteFund = async (id: string) => {
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Fund not found');
  }

  const fund = await prisma.transaction.delete({ where: { id } });
  return fund;
};

export const FundService = {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund,
};