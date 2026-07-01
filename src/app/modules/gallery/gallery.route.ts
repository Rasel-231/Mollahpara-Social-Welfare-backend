import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { GalleryController } from './gallery.controller';
import { GalleryValidation } from './gallery.validation';
import { FileUploadHelper } from '../../../shared/fileUploader';

const router = Router();

router.post(
  '/upload',
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(GalleryValidation.create),
  GalleryController.createGallery,
);

router.get('/', GalleryController.getAllGalleries);
router.get('/:id', GalleryController.getGalleryById);

router.patch(
  '/:id',
  // auth('ADMIN'),
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(GalleryValidation.update),
  GalleryController.updateGallery,
);

router.delete('/:id', auth('ADMIN'), GalleryController.deleteGallery);

export const GalleryRoutes = router;
