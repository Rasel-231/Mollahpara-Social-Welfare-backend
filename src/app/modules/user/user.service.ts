import bcrypt from 'bcryptjs';
import config from '../../../config';
import { paginationHelper } from '../../../shared/paginationHelper';
import { prisma } from '../../../shared/prisma';
import { FileUploadHelper } from '../../../shared/fileUploader';

interface IFile {
  path: string;
  fieldname: string;
  originalname: string;
}

interface IUserPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  designation?: string;
  image?: string;
  village: string;
  bloodGroup?: string;
  role?: string;
  memberType?: string;
  nid?: string;
}

interface IUserFilter {
  searchTerm?: string;
  name?: string;
  email?: string;
  phone?: string;
  village?: string;
  designation?: string;
  bloodGroup?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

const createUser = async (payload: IUserPayload, file?: IFile) => {
  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;

  }
  const { password, images, ...userData } = payload as any;

  const saltRounds = Number(config.salt_round) || 12;
  const hashedPassword = await bcrypt.hash(password as string, saltRounds);

  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      image: payload.image,
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

  const { page: pageNum, limit: limitNum, skip, sortBy: sortField, sortOrder: sortDir } =
    paginationHelper.calculatePagination({ page, limit, sortBy, sortOrder });

  const andConditions: Record<string, unknown>[] = [];

  const searchCondition = paginationHelper.searchFields(searchTerm, ['name', 'email', 'phone', 'village', 'designation']);
  if (searchCondition) andConditions.push(searchCondition);

  const filterCondition = paginationHelper.filterFields(filterData);
  if (filterCondition) andConditions.push(filterCondition);

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { [sortField]: sortDir },

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
      createdAt: true,
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id: string, payload: Partial<IUserPayload>, file?: any) => {

  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }
  if (payload.password) {
    const saltRounds = Number(config.salt_round) || 12;
    payload.password = await bcrypt.hash(payload.password, saltRounds);
  }


  return await prisma.user.update({
    where: { id },
    data: payload,
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

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};