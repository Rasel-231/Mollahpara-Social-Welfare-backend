import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { GalleryService } from './gallery.service';

const createGallery = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.createGallery(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery image added successfully',
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
  const result = await GalleryService.updateGallery(req.params.id as string, req.body);

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
