import { prisma } from '../../../shared/prisma';

interface IGalleryCategoryPayload {
  name: string;
  label: string;
  icon?: string;
  sortOrder?: number;
};

const createCategory = async (payload: IGalleryCategoryPayload) => {
  const existing = await prisma.galleryCategory.findUnique({ where: { name: payload.name } });
  if (existing) throw new Error('Category name already exists');

  return await prisma.galleryCategory.create({ data: payload });
};

const getAllCategories = async () => {
  return await prisma.galleryCategory.findMany({
    orderBy: { sortOrder: 'asc' },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!category) throw new Error('Category not found');
  return category;
};

const updateCategory = async (id: string, payload: Partial<IGalleryCategoryPayload>) => {
  const existing = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!existing) throw new Error('Category not found');

  if (payload.name && payload.name !== existing.name) {
    const nameTaken = await prisma.galleryCategory.findUnique({ where: { name: payload.name } });
    if (nameTaken) throw new Error('Category name already exists');
  }

  return await prisma.galleryCategory.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  const existing = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!existing) throw new Error('Category not found');

  return await prisma.galleryCategory.delete({ where: { id } });
};

export const GalleryCategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
