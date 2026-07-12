import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { GalleryCategoryController } from './galleryCategory.controller';
import { GalleryCategoryValidation } from './galleryCategory.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(GalleryCategoryValidation.create),
  GalleryCategoryController.createCategory,
);

router.get('/', GalleryCategoryController.getAllCategories);
router.get('/:id', GalleryCategoryController.getCategoryById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(GalleryCategoryValidation.update),
  GalleryCategoryController.updateCategory,
);

router.delete('/:id', auth('ADMIN'), GalleryCategoryController.deleteCategory);

export const GalleryCategoryRoutes = router;
