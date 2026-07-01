import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NewsService } from './news.service';

const createNews = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const result = await NewsService.createNews(payload, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'News created successfully',
    data: result,
  });
});

const getAllNews = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsService.getAllNews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'News retrieved successfully',
    data: result,
  });
});

const getNewsById = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsService.getNewsById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'News retrieved successfully',
    data: result,
  });
});

const updateNews = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const result = await NewsService.updateNews(req.params.id as string, payload, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'News updated successfully',
    data: result,
  });
});

const deleteNews = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsService.deleteNews(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'News deleted successfully',
    data: result,
  });
});

export const NewsController = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
