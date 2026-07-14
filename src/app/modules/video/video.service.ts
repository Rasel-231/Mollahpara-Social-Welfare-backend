import { prisma } from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

interface IVideoPayload {
  title: string;
  videoUrl: string;
}

const createVideo = async (payload: IVideoPayload) => {
  return await prisma.video.create({ data: payload });
};

const getAllVideos = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['title']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  return await prisma.video.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const getVideoById = async (id: string) => {
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) throw new AppError(404, 'Video not found');
  return video;
};

const updateVideo = async (id: string, payload: Partial<IVideoPayload>) => {
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Video not found');

  return await prisma.video.update({
    where: { id },
    data: payload,
  });
};

const deleteVideo = async (id: string) => {
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Video not found');

  return await prisma.video.delete({ where: { id } });
};

export const VideoService = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
