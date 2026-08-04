import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

const createDonor = async (payload: Prisma.DonorCreateInput) => {
  const donor = await prisma.donor.create({
    data: payload,
  });

  return donor;
};

const getAllDonors = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['name', 'phone', 'address']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const donors = await prisma.donor.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return donors;
};

const getDonorById = async (id: string) => {
  const donor = await prisma.donor.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!donor) {
    throw new AppError(404, 'Donor not found');
  }

  return donor;
};

const updateDonor = async (id: string, payload: Prisma.DonorUpdateInput) => {
  const existing = await prisma.donor.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Donor not found');
  }

  const donor = await prisma.donor.update({
    where: { id },
    data: payload,
  });

  return donor;
};

const deleteDonor = async (id: string) => {
  const existing = await prisma.donor.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Donor not found');
  }

  const donor = await prisma.donor.delete({
    where: { id },
  });

  return donor;
};

export const DonorService = {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
