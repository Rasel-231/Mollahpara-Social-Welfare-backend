import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import prisma from '../shared/prisma';

const auth = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'You are not authorized',
        });
      }

      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      const member = await prisma.member.findUnique({
        where: { id: decoded.id },
      });

      if (!member) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid token',
        });
      }

      if (allowedRoles.length && !allowedRoles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: 'You do not have permission to access this resource',
        });
      }

      (req as any).user = member;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  };
};

export default auth;
