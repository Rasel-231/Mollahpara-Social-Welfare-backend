import bcrypt from 'bcryptjs';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { FileUploadHelper } from '../../../shared/fileUploader';

// টাইপ ডিফিনিশন
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

const getAllUsers = async () => {
  return await prisma.user.findMany({

  });
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