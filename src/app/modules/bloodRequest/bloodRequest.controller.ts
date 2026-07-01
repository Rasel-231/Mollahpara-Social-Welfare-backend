import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BloodRequestService } from './bloodRequest.service';

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  if ((req as any).user?.id) {
    req.body.requesterId = (req as any).user.id;
  }

  const result = await BloodRequestService.createBloodRequest(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blood request submitted successfully',
    data: result,
  });
});

const getAllBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getAllBloodRequests();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood requests retrieved successfully',
    data: result,
  });
});

const getBloodRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getBloodRequestById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request retrieved successfully',
    data: result,
  });
});

const updateBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.updateBloodRequest(req.params.id as string, req.body);
  console.log("user params", req.params.id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request updated successfully',
    data: result,
  });
});

const deleteBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.deleteBloodRequest(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blood request deleted successfully',
    data: result,
  });
});

export const BloodRequestController = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
};
