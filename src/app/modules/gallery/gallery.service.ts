import prisma from '../../../shared/prisma';

const createGallery = async (payload: any) => {
  const gallery = await prisma.gallery.create({ data: payload });
  return gallery;
};

const getAllGalleries = async () => {
  const galleries = await prisma.gallery.findMany({
    include: { uploader: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return galleries;
};

const getGalleryById = async (id: string) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { uploader: { select: { id: true, name: true } } },
  });
  if (!gallery) throw new Error('Gallery not found');
  return gallery;
};

const updateGallery = async (id: string, payload: any) => {
  const gallery = await prisma.gallery.update({
    where: { id },
    data: payload,
  });
  return gallery;
};

const deleteGallery = async (id: string) => {
  const gallery = await prisma.gallery.delete({ where: { id } });
  return gallery;
};

export const GalleryService = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
