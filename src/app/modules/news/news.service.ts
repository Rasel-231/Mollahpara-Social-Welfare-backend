import prisma from '../../../shared/prisma';

const createNews = async (payload: any) => {
  const news = await prisma.post.create({
    data: { ...payload, type: 'NEWS' },
  });
  return news;
};

const getAllNews = async () => {
  const news = await prisma.post.findMany({
    where: { type: 'NEWS' },
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return news;
};

const getNewsById = async (id: string) => {
  const news = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, image: true } } },
  });
  if (!news) throw new Error('News not found');
  return news;
};

const updateNews = async (id: string, payload: any) => {
  const news = await prisma.post.update({ where: { id }, data: payload });
  return news;
};

const deleteNews = async (id: string) => {
  const news = await prisma.post.delete({ where: { id } });
  return news;
};

export const NewsService = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
