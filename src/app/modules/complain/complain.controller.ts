import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ComplainService } from './complain.service';

const createComplain = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplainService.createComplain(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Complain submitted successfully',
    data: result,
  });
});

const getAllComplains = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplainService.getAllComplains();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Complains retrieved successfully',
    data: result,
  });
});

const getSingleComplain = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplainService.getSingleComplain(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Complain retrieved successfully',
    data: result,
  });
});

const updateComplain = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplainService.updateComplain(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Complain updated successfully',
    data: result,
  });
});

const deleteComplain = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplainService.deleteComplain(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Complain deleted successfully',
    data: result,
  });
});

export const ComplainController = {
  createComplain,
  getAllComplains,
  getSingleComplain,
  updateComplain,
  deleteComplain,
};
