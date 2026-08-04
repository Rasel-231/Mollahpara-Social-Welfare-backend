import bcrypt from 'bcryptjs';
import config from '../../../config';
import { paginationHelper } from '../../../shared/paginationHelper';
import { prisma } from '../../../shared/prisma';
import { FileUploadHelper, IUploadedFile } from '../../../shared/fileUploader';
import { BloodGroup, MemberType, Prisma, Role } from '@prisma/client';
import AppError from '../../../errors/AppError';

interface IUserPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  designation?: string;
  image?: string;
  village: string;
  bloodGroup?: BloodGroup;
  memberType?: MemberType;
  nid?: string;
}

export interface IUserFilter {
  searchTerm?: string;
  name?: string;
  email?: string;
  phone?: string;
  village?: string;
  designation?: string;
  bloodGroup?: string;
  role?: string;
  isActive?: string;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
}

const createUser = async (payload: IUserPayload, file?: IUploadedFile) => {
  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }
  const { password, ...userData } = payload;

  const saltRounds = Number(config.salt_round) || 12;
  const hashedPassword = await bcrypt.hash(password as string, saltRounds);

  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });
};

const getAllUsers = async (params: IUserFilter) => {
  const { page, limit, sortBy, sortOrder, searchTerm, ...filterData } = params;

  const { page: pageNum, limit: limitNum, skip, sortBy: sortFieldRaw, sortOrder: sortOrderRaw } =
    paginationHelper.calculatePagination({ page, limit, sortBy, sortOrder });

  const allowedSortFields = [
    'id',
    'name',
    'email',
    'phone',
    'village',
    'designation',
    'bloodGroup',
    'role',
    'isActive',
    'memberType',
    'nid',
    'createdAt',
    'updatedAt',
  ];
  const sortField = allowedSortFields.includes(sortFieldRaw) ? sortFieldRaw : 'createdAt';
  const sortDir = sortOrderRaw?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const andConditions: Prisma.UserWhereInput[] = [];

  // সার্চ কন্ডিশন
  if (searchTerm) {
    andConditions.push({
      OR: ['name', 'email', 'phone', 'village', 'designation'].map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as const }
      }))
    } as Prisma.UserWhereInput);
  }


  if (Object.keys(filterData).length > 0) {
    const filterCondition: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filterData)) {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'isActive') {
          filterCondition.isActive = value === 'true';
        } else if (key === 'role' || key === 'bloodGroup' || key === 'memberType') {
          filterCondition[key] = value;
        } else {
          filterCondition[key] = value;
        }
      }
    }

    if (Object.keys(filterCondition).length > 0) {
      andConditions.push(filterCondition as Prisma.UserWhereInput);
    }
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};


  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { [sortField]: sortDir },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        image: true,
        village: true,
        bloodGroup: true,
        role: true,
        nid: true,
        isActive: true,
        memberType: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: { page: pageNum, limit: limitNum, total },
  };
};
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      village: true,
      bloodGroup: true,
      role: true,
      nid: true,
      isActive: true,
      memberType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new AppError(404, 'User not found');
  return user;
};

const updateUser = async (id: string, payload: Partial<IUserPayload>, file?: IUploadedFile) => {

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }
  if (payload.password) {
    const saltRounds = Number(config.salt_round) || 12;
    payload.password = await bcrypt.hash(payload.password, saltRounds);
  }

  const updateData = { ...payload };

  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      createdAt: true,
    },
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};

const approveUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      isActive: true,
      createdAt: true,
    },
  });
};

const rejectUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      isActive: true,
      createdAt: true,
    },
  });
};

const changeRole = async (id: string, role: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  return await prisma.user.update({
    where: { id },
    data: { role: role as Role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  approveUser,
  rejectUser,
  changeRole,
};