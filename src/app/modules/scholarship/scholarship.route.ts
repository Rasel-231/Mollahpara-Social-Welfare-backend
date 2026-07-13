import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { ScholarshipController } from './scholarship.controller';
import { ScholarshipValidation } from './scholarship.validation';
import { FileUploadHelper } from '../../../shared/fileUploader';

const router = Router();

router.post(
  '/apply',
  FileUploadHelper.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 },
  ]),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ScholarshipValidation.create),
  ScholarshipController.createApplication,
);

router.get('/', auth('ADMIN'), ScholarshipController.getAllApplications);
router.get('/:id', auth('ADMIN'), ScholarshipController.getSingleApplication);
router.patch(
  '/:id',
  auth('ADMIN'),
  FileUploadHelper.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 },
  ]),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ScholarshipValidation.update),
  ScholarshipController.updateApplication,
);
router.delete('/:id', auth('ADMIN'), ScholarshipController.deleteApplication);

export const ScholarshipRoutes = router;
