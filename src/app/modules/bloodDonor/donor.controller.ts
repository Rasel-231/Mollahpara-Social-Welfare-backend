import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DonorService } from './donor.service';

const createDonor = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.createDonor(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Donor registered successfully',
    data: result,
  });
});

const getAllDonors = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.getAllDonors();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donors retrieved successfully',
    data: result,
  });
});

const getDonorById = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.getDonorById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor retrieved successfully',
    data: result,
  });
});

const updateDonor = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.updateDonor(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor updated successfully',
    data: result,
  });
});

const deleteDonor = catchAsync(async (req: Request, res: Response) => {
  const result = await DonorService.deleteDonor(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor deleted successfully',
    data: result,
  });
});

export const DonorController = {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
