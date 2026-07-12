import { prisma } from '../../../shared/prisma';
import { FileUploadHelper } from '../../../shared/fileUploader';

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
    throw new Error("Image is required for gallery creation");
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

const getAllGalleries = async () => {
  return await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
};

const getGalleryById = async (id: string) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { category: true },
  });
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
