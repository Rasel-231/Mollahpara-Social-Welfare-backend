import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import { FileUploadHelper } from '../../../shared/fileUploader';
import AppError from '../../../errors/AppError';

interface IFile {
  path: string;
  fieldname: string;
  originalname: string;
}

interface IGalleryPayload {
  title: string;
  categoryId?: string;
  image?: string;
}

const createGallery = async (payload: IGalleryPayload, file?: IFile) => {
  let imageUrl = payload.image || "";
  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    imageUrl = uploadedImage.secure_url;
  }
  if (!imageUrl) {
    throw new AppError(400, 'Image is required for gallery creation');
  }

  return await prisma.gallery.create({
    data: {
      title: payload.title,
      categoryId: payload.categoryId || null,
      image: imageUrl,
    },
    include: { category: true },
  });
};

const getAllGalleries = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['title']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  return await prisma.gallery.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
};

const getGalleryById = async (id: string) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!gallery) throw new AppError(404, 'Gallery not found');
  return gallery;
};

const updateGallery = async (id: string, payload: Partial<IGalleryPayload>, file?: IFile) => {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Gallery not found');

  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }

  return await prisma.gallery.update({
    where: { id },
    data: {
      title: payload.title,
      categoryId: payload.categoryId,
      image: payload.image,
    },
    include: { category: true },
  });
};

const deleteGallery = async (id: string) => {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Gallery not found');

  return await prisma.gallery.delete({ where: { id } });
};

export const GalleryService = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
