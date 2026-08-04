import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

const createBloodRequest = async (payload: Prisma.BloodRequestUncheckedCreateInput) => {

  const bloodRequest = await prisma.bloodRequest.create({
    data: {
      patientName: payload.patientName,
      bloodGroup: payload.bloodGroup,
      hospitalName: payload.hospitalName,
      contactPhone: payload.contactPhone,
      requiredDate: new Date(payload.requiredDate),
      unitsRequired: Number(payload.unitsRequired),
      urgency: payload.urgency,
      notes: payload.notes,
      requesterId: payload.requesterId,
    },
    include: { requester: true },
  });

  return bloodRequest;
};

const getAllBloodRequests = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['patientName', 'hospitalName', 'contactPhone']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  return await prisma.bloodRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { requester: true },
  });
};

const getBloodRequestById = async (id: string) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id },
    include: { requester: true },
  });

  if (!bloodRequest) {
    throw new AppError(404, 'Blood request not found');
  }

  return bloodRequest;
};

const updateBloodRequest = async (id: string, payload: Prisma.BloodRequestUpdateInput) => {
  const existing = await prisma.bloodRequest.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Blood request not found');
  }

  const dataToUpdate: Prisma.BloodRequestUpdateInput = {
    ...payload,
    ...(typeof payload.requiredDate === 'string'
      ? { requiredDate: new Date(payload.requiredDate) }
      : {}),
    ...(typeof payload.unitsRequired === 'number'
      ? { unitsRequired: payload.unitsRequired }
      : {}),
  };

  return await prisma.bloodRequest.update({
    where: { id },
    data: dataToUpdate,
  });
};

const deleteBloodRequest = async (id: string) => {
  const existing = await prisma.bloodRequest.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Blood request not found');
  }

  return await prisma.bloodRequest.delete({
    where: { id },
  });
};

export const BloodRequestService = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
};