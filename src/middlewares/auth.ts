import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import config from '../config';
import { prisma } from '../shared/prisma';

const auth = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'You are not authorized',
        });
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, config.jwt.jwt_secret) as JwtPayload;
      } catch (err) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid or expired token',
        });
      }

      if (!decoded?.id) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid token payload',
        });
      }

      const member = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!member) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid token',
        });
      }

      if (!member.isActive) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Your account is not active',
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