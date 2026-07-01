import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ScholarshipService } from './scholarship.service';

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ScholarshipService.createApplication(payload, files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Scholarship application submitted successfully',
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await ScholarshipService.getAllApplications();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Scholarship applications retrieved successfully',
    data: result,
  });
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ScholarshipService.getSingleApplication(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Scholarship application retrieved successfully',
    data: result,
  });
});

const updateApplication = catchAsync(async (req: Request, res: Response) => {
  const payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  const result = await ScholarshipService.updateApplication(req.params.id as string, payload, files);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Scholarship application updated successfully',
    data: result,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ScholarshipService.deleteApplication(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Scholarship application deleted successfully',
    data: result,
  });
});

export const ScholarshipController = {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
};
