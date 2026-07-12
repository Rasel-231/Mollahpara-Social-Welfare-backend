import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { GalleryCategoryService } from './galleryCategory.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryCategoryService.createCategory(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Category created successfully', data: result });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryCategoryService.getAllCategories();
  sendResponse(res, { statusCode: 200, success: true, message: 'Categories retrieved successfully', data: result });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryCategoryService.getCategoryById(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category retrieved successfully', data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryCategoryService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category updated successfully', data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryCategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category deleted successfully', data: result });
});

export const GalleryCategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
