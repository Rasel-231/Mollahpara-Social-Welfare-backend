import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FundService } from './fund.service';

const createFund = catchAsync(async (req: Request, res: Response) => {
  const result = await FundService.createFund(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Fund created successfully',
    data: result,
  });
});

const getAllFunds = catchAsync(async (req: Request, res: Response) => {
  const result = await FundService.getAllFunds();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Funds retrieved successfully',
    data: result,
  });
});

const getFundById = catchAsync(async (req: Request, res: Response) => {
  const result = await FundService.getFundById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fund retrieved successfully',
    data: result,
  });
});

const updateFund = catchAsync(async (req: Request, res: Response) => {
  const result = await FundService.updateFund(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fund updated successfully',
    data: result,
  });
});

const deleteFund = catchAsync(async (req: Request, res: Response) => {
  const result = await FundService.deleteFund(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fund deleted successfully',
    data: result,
  });
});

export const FundController = {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund,
};