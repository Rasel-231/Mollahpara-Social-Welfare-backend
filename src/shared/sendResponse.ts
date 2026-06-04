import { Response } from 'express';

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const sendResponse = <T>(res: Response, data: IResponse<T>): void => {
  const response: IResponse<T> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || 'Success',
    data: data.data,
    meta: data.meta,
  };
  res.status(data.statusCode).json(response);
};

export default sendResponse;
