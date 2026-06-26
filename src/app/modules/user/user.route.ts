import { Router } from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { FileUploadHelper } from '../../../shared/fileUploader';

const router = Router();

// Create User
router.post(
  '/create',
  FileUploadHelper.upload.single('file'), // ফাইল ধরুন
  (req, res, next) => {
    // ফর্ম-ডাটা থেকে ডাটা পার্স করুন
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(UserValidation.create),
  UserController.createUser,
);

// Get All Users
router.get('/', UserController.getAllUsers);

// Get User By Id
router.get('/:id', UserController.getUserById);

// Update User
router.patch(
  '/:id',
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

// Delete User
router.delete('/:id', UserController.deleteUser);

export const UserRoutes = router;