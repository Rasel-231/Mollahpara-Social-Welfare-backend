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

// Create User (Admin only)
router.post(
  '/create',
  auth('ADMIN'),
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(UserValidation.create),
  UserController.createUser,
);

// Get All Users (Any logged-in user)
router.get('/', auth(), UserController.getAllUsers);

// Get User By Id (Any logged-in user)
router.get('/:id', auth(), UserController.getUserById);

// Update User (Admin or Owner)
router.patch(
  '/:id',
  auth(),
  ownerOrAdmin,
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(UserValidation.update),
  UserController.updateUser,
);

// Delete User (Admin only)
router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

// Approve User (Admin only)
router.patch('/:id/approve', auth('ADMIN'), UserController.approveUser);

// Reject User (Admin only)
router.patch('/:id/reject', auth('ADMIN'), UserController.rejectUser);

// Change User Role (Admin only)
router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(UserValidation.changeRole),
  UserController.changeRole,
);

export const UserRoutes = router;