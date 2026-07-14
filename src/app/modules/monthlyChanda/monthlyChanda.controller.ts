import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MonthlyChandaService } from './monthlyChanda.service';

const createChanda = catchAsync(async (req: Request, res: Response) => {
  const result = await MonthlyChandaService.createChanda(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Chanda created successfully', data: result });
});

const getAllChandas = catchAsync(async (req: Request, res: Response) => {
  const result = await MonthlyChandaService.getAllChandas({ searchTerm: req.query.search as string });
  sendResponse(res, { statusCode: 200, success: true, message: 'Chandas retrieved successfully', data: result });
});

const getChandaById = catchAsync(async (req: Request, res: Response) => {
  const result = await MonthlyChandaService.getChandaById(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Chanda retrieved successfully', data: result });
});

const updateChanda = catchAsync(async (req: Request, res: Response) => {
  const result = await MonthlyChandaService.updateChanda(req.params.id as string, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Chanda updated successfully', data: result });
});

const deleteChanda = catchAsync(async (req: Request, res: Response) => {
  const result = await MonthlyChandaService.deleteChanda(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Chanda deleted successfully', data: result });
});

export const MonthlyChandaController = { createChanda, getAllChandas, getChandaById, updateChanda, deleteChanda };
