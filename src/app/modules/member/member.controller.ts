import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MemberService } from './member.service';

const createMember = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.createMember(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Member created successfully',
    data: result,
  });
});

const getAllMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.getAllMembers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Members retrieved successfully',
    data: result,
  });
});

const getMemberById = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.getMemberById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member retrieved successfully',
    data: result,
  });
});

const updateMember = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.updateMember(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member updated successfully',
    data: result,
  });
});

const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.deleteMember(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member deleted successfully',
    data: result,
  });
});

export const MemberController = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
