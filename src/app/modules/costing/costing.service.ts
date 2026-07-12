import { prisma } from '../../../shared/prisma';

const createCosting = async (payload: any) => {
  const result = await prisma.costing.create({ data: payload });
  return result;
};

const getAllCostings = async () => {
  const result = await prisma.costing.findMany({
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
    throw new Error('Costing not found');
  }
  return result;
};

const updateCosting = async (id: string, payload: any) => {
  const existing = await prisma.costing.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Costing not found');
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
    throw new Error('Costing not found');
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
