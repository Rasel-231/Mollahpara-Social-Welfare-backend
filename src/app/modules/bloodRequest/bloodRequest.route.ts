import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { BloodRequestController } from './bloodRequest.controller';
import { BloodRequestValidation } from './bloodRequest.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(BloodRequestValidation.create),
  BloodRequestController.createBloodRequest,
);
router.get('/', BloodRequestController.getAllBloodRequests);
router.get('/:id', BloodRequestController.getBloodRequestById);
router.patch(
  '/:id',
  // auth('ADMIN', 'MODERATOR'),
  validateRequest(BloodRequestValidation.update),
  BloodRequestController.updateBloodRequest,
);
router.delete(
  '/:id',
  auth('ADMIN'),
  BloodRequestController.deleteBloodRequest,
);

export const BloodRequestRoutes = router;
