import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import { IComplain } from './complain.interface';
import AppError from '../../../errors/AppError';


const createComplain = async (data: IComplain) => {
  return await prisma.complain.create({ data });
};

const getAllComplains = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['name', 'phone', 'village', 'subject', 'message']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  return await prisma.complain.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const getSingleComplain = async (id: string) => {
  const complain = await prisma.complain.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!complain) throw new AppError(404, 'Complain not found');
  return complain;
};

const updateComplain = async (id: string, data: Partial<IComplain>) => {
  const existing = await prisma.complain.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Complain not found');

  return await prisma.complain.update({
    where: { id },
    data
  });
};

const deleteComplain = async (id: string) => {
  const existing = await prisma.complain.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Complain not found');

  return await prisma.complain.delete({ where: { id } });
};

export const ComplainService = {
  createComplain,
  getAllComplains,
  getSingleComplain,
  updateComplain,
  deleteComplain,
};