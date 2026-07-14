import { Router, NextFunction, Request, Response } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { FileUploadHelper } from '../../../shared/fileUploader';
import auth from '../../../middlewares/auth';

const router = Router();

const ownerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user?.role === 'ADMIN' || user?.id === req.params.id) {
    return next();
  }
  return res.status(403).json({
    success: false,
    statusCode: 403,
    message: 'You can only update your own profile',
  });
};


router.post(
  '/create',
  auth('ADMIN'),
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      try { req.body = JSON.parse(req.body.data); } catch { return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid JSON in request body' }); }
    }
    next();
  },
  validateRequest(UserValidation.create),
  UserController.createUser,
);

router.get('/', UserController.getAllUsers);


router.get('/:id', UserController.getUserById);


router.patch(
  '/:id',
  auth(),
  ownerOrAdmin,
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      try { req.body = JSON.parse(req.body.data); } catch { return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid JSON in request body' }); }
    }
    next();
  },
  validateRequest(UserValidation.update),
  UserController.updateUser,
);


router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

router.patch('/:id/approve', auth('ADMIN'), UserController.approveUser);


router.patch('/:id/reject', auth('ADMIN'), UserController.rejectUser);


router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(UserValidation.changeRole),
  UserController.changeRole,
);

export const UserRoutes = router;