import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProjectFundService } from './projectFund.service';

const createFund = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectFundService.createFund(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Project fund created successfully', data: result });
});

const getAllFunds = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectFundService.getAllFunds();
  sendResponse(res, { statusCode: 200, success: true, message: 'Project funds retrieved successfully', data: result });
});

const getFundById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectFundService.getFundById(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Project fund retrieved successfully', data: result });
});

const updateFund = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectFundService.updateFund(req.params.id as string, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Project fund updated successfully', data: result });
});

const deleteFund = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectFundService.deleteFund(req.params.id as string);
  sendResponse(res, { statusCode: 200, success: true, message: 'Project fund deleted successfully', data: result });
});

export const ProjectFundController = { createFund, getAllFunds, getFundById, updateFund, deleteFund };
