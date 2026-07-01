import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { NewsController } from './news.controller';
import { NewsValidation } from './news.validation';
import { FileUploadHelper } from '../../../shared/fileUploader';

const router = Router();

router.post(
  '/',
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(NewsValidation.create),
  NewsController.createNews,
);

router.get('/', NewsController.getAllNews);
router.get('/:id', NewsController.getNewsById);

router.patch(
  '/:id',
  FileUploadHelper.upload.single('file'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(NewsValidation.update),
  NewsController.updateNews,
);

router.delete('/:id', auth('ADMIN'), NewsController.deleteNews);

export const NewsRoutes = router;
