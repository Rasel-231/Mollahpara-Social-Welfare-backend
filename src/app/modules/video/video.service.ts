import { prisma } from '../../../shared/prisma';

interface IVideoPayload {
  title: string;
  videoUrl: string;
}

const createVideo = async (payload: IVideoPayload) => {
  return await prisma.video.create({ data: payload });
};

const getAllVideos = async () => {
  return await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getVideoById = async (id: string) => {
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) throw new Error('Video not found');
  return video;
};

const updateVideo = async (id: string, payload: Partial<IVideoPayload>) => {
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) throw new Error('Video not found');

  return await prisma.video.update({
    where: { id },
    data: payload,
  });
};

const deleteVideo = async (id: string) => {
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) throw new Error('Video not found');

  return await prisma.video.delete({ where: { id } });
};

export const VideoService = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
