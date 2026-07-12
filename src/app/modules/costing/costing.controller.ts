import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CostingService } from './costing.service';

const createCosting = catchAsync(async (req: Request, res: Response) => {
  const result = await CostingService.createCosting(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Costing created successfully',
    data: result,
  });
});

const getAllCostings = catchAsync(async (req: Request, res: Response) => {
  const result = await CostingService.getAllCostings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Costings retrieved successfully',
    data: result,
  });
});

const getCostingById = catchAsync(async (req: Request, res: Response) => {
  const result = await CostingService.getCostingById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Costing retrieved successfully',
    data: result,
  });
});

const updateCosting = catchAsync(async (req: Request, res: Response) => {
  const result = await CostingService.updateCosting(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Costing updated successfully',
    data: result,
  });
});

const deleteCosting = catchAsync(async (req: Request, res: Response) => {
  const result = await CostingService.deleteCosting(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Costing deleted successfully',
    data: result,
  });
});

export const CostingController = {
  createCosting,
  getAllCostings,
  getCostingById,
  updateCosting,
  deleteCosting,
};
