import { prisma } from '../../../shared/prisma';
import { FileUploadHelper } from '../../../shared/fileUploader';

interface IFile {
  path: string;
  fieldname: string;
  originalname: string;
}

interface IGalleryPayload {
  title: string;
  category?: string;
  image?: string;
}

const createGallery = async (payload: IGalleryPayload, file?: IFile) => {
  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }

  return await prisma.gallery.create({
    data: payload as any,
  });
};

const getAllGalleries = async () => {
  return await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getGalleryById = async (id: string) => {
  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery) throw new Error('Gallery not found');
  return gallery;
};

const updateGallery = async (id: string, payload: Partial<IGalleryPayload>, file?: IFile) => {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error('Gallery not found');

  if (file) {
    const uploadedImage: any = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }

  return await prisma.gallery.update({
    where: { id },
    data: payload,
  });
};

const deleteGallery = async (id: string) => {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error('Gallery not found');

  return await prisma.gallery.delete({ where: { id } });
};

export const GalleryService = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
