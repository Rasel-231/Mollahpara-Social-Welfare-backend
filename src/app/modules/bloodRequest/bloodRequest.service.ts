import { prisma } from '../../../shared/prisma';

const createBloodRequest = async (payload: any) => {
  const bloodRequest = await prisma.bloodRequest.create({
    data: payload,
    include: { requester: true },
  });

  return bloodRequest;
};

const getAllBloodRequests = async () => {
  const bloodRequests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { requester: true },
  });

  return bloodRequests;
};

const getBloodRequestById = async (id: string) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id },
    include: { requester: true },
  });

  if (!bloodRequest) {
    throw new Error('Blood request not found');
  }

  return bloodRequest;
};

const updateBloodRequest = async (id: string, payload: any) => {
  const existing = await prisma.bloodRequest.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Blood request not found');
  }

  const bloodRequest = await prisma.bloodRequest.update({
    where: { id },
    data: payload,
  });

  return bloodRequest;
};

const deleteBloodRequest = async (id: string) => {
  const existing = await prisma.bloodRequest.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Blood request not found');
  }

  const bloodRequest = await prisma.bloodRequest.delete({
    where: { id },
  });

  return bloodRequest;
};

export const BloodRequestService = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
};
