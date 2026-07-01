import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VideoService } from './video.service';

const createVideo = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.createVideo(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Video created successfully',
    data: result,
  });
});

const getAllVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.getAllVideos();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Videos retrieved successfully',
    data: result,
  });
});

const getVideoById = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.getVideoById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Video retrieved successfully',
    data: result,
  });
});

const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.updateVideo(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Video updated successfully',
    data: result,
  });
});

const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.deleteVideo(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Video deleted successfully',
    data: result,
  });
});

export const VideoController = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
