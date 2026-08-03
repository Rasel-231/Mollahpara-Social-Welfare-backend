import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import config from '../config';
import { prisma } from '../shared/prisma';
import AppError from '../errors/AppError';

const auth = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(401, 'You are not authorized');
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, config.jwt.jwt_secret) as JwtPayload;
      } catch (err) {
        throw new AppError(401, 'Invalid or expired token');
      }

      if (!decoded?.id) {
        throw new AppError(401, 'Invalid token payload');
      }

      const member = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          village: true,
          image: true,
          designation: true,
          bloodGroup: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!member) {
        throw new AppError(401, 'Invalid token');
      }

      // if (!member.isActive) {
      //   throw new AppError(401, 'Your account is not active');
      // }

      if (allowedRoles.length && !allowedRoles.includes(member.role)) {
        throw new AppError(403, 'You do not have permission to access this resource');
      }

      req.user = member;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
