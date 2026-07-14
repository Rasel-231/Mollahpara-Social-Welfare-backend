import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

const createCosting = async (payload: any) => {
  const result = await prisma.costing.create({ data: payload });
  return result;
};

const getAllCostings = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['projectName', 'description']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.costing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { transactions: true },
  });
  return result;
};

const getCostingById = async (id: string) => {
  const result = await prisma.costing.findUnique({
    where: { id },
    include: { transactions: true },
  });
  if (!result) {
    throw new AppError(404, 'Costing not found');
  }
  return result;
};

const updateCosting = async (id: string, payload: any) => {
  const existing = await prisma.costing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Costing not found');
  }
  const result = await prisma.costing.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCosting = async (id: string) => {
  const existing = await prisma.costing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Costing not found');
  }
  const result = await prisma.costing.delete({ where: { id } });
  return result;
};

export const CostingService = {
  createCosting,
  getAllCostings,
  getCostingById,
  updateCosting,
  deleteCosting,
};
