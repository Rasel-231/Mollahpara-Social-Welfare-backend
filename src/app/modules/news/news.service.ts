import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import { FileUploadHelper, IUploadedFile } from '../../../shared/fileUploader';
import { Prisma } from '@prisma/client';
import AppError from '../../../errors/AppError';

interface INewsPayload {
  title: string;
  content: string;
  authorId: string;
  slug?: string;
  image?: string;
  published?: boolean;
  publishedAt?: string;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now();
};

const createNews = async (payload: INewsPayload, file?: IUploadedFile) => {
  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }

  if (!payload.slug) {
    payload.slug = generateSlug(payload.title);
  }

  return await prisma.post.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      image: payload.image,
      authorId: payload.authorId,
      type: 'NEWS',
      published: payload.published ?? false,
      publishedAt: payload.published ? new Date().toISOString() : undefined,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
};

const getAllNews = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [{ type: 'NEWS' }];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['title', 'content']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = { AND: andConditions };
  return await prisma.post.findMany({
    where,
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getNewsById = async (id: string) => {
  const news = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, image: true } } },
  });
  if (!news) throw new AppError(404, 'News not found');
  return news;
};

const updateNews = async (id: string, payload: Partial<INewsPayload>, file?: IUploadedFile) => {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'News not found');

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    payload.image = uploadedImage.secure_url;
  }

  const data: Prisma.PostUpdateInput = { ...payload };
  if (payload.published && !existing.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }

  return await prisma.post.update({
    where: { id },
    data,
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
};

const deleteNews = async (id: string) => {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'News not found');

  return await prisma.post.delete({ where: { id } });
};

export const NewsService = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
