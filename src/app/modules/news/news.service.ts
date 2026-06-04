import prisma from '../../../shared/prisma';

const createNews = async (payload: any) => {
  const news = await prisma.news.create({ data: payload });
  return news;
};

const getAllNews = async () => {
  const news = await prisma.news.findMany({
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return news;
};

const getNewsById = async (id: string) => {
  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, image: true } } },
  });
  if (!news) throw new Error('News not found');
  return news;
};

const updateNews = async (id: string, payload: any) => {
  const news = await prisma.news.update({ where: { id }, data: payload });
  return news;
};

const deleteNews = async (id: string) => {
  const news = await prisma.news.delete({ where: { id } });
  return news;
};

export const NewsService = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
