import { NextFunction, Request, Response } from 'express';
import config from '../config';

interface IGenericError {
  path: string;
  message: string;
}

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: IGenericError[] = [];

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate key error';
    errors = [
      {
        path: err.meta?.target?.[0] || 'field',
        message: 'A record with this value already exists',
      },
    ];
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
