import { prisma } from '../../../shared/prisma';

const createDonor = async (payload: any) => {
  const donor = await prisma.donor.create({
    data: payload,
  });

  return donor;
};

const getAllDonors = async () => {
  const donors = await prisma.donor.findMany({
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
    throw new Error('Donor not found');
  }

  return donor;
};

const updateDonor = async (id: string, payload: any) => {
  const existing = await prisma.donor.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Donor not found');
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
    throw new Error('Donor not found');
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
