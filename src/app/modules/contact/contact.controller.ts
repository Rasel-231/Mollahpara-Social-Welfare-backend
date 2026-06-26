import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactService } from './contact.service';

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContact(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contact submitted successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllContacts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getContactById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  });
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.updateContact(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.deleteContact(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
