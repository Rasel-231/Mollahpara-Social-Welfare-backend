import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { GalleryService } from './gallery.service';

const createGallery = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const result = await GalleryService.createGallery(payload, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery created successfully',
    data: result,
  });
});

const getAllGalleries = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getAllGalleries();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Galleries retrieved successfully',
    data: result,
  });
});

const getGalleryById = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getGalleryById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery retrieved successfully',
    data: result,
  });
});

const updateGallery = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const result = await GalleryService.updateGallery(req.params.id as string, payload, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery updated successfully',
    data: result,
  });
});

const deleteGallery = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.deleteGallery(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery deleted successfully',
    data: result,
  });
});

export const GalleryController = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
