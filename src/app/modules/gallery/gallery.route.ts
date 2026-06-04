import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { GalleryController } from './gallery.controller';
import { GalleryValidation } from './gallery.validation';

const router = Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(GalleryValidation.create),
  GalleryController.createGallery
);
router.get('/', GalleryController.getAllGalleries);
router.get('/:id', GalleryController.getGalleryById);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(GalleryValidation.update),
  GalleryController.updateGallery
);
router.delete('/:id', auth('admin'), GalleryController.deleteGallery);

export const GalleryRoutes = router;
