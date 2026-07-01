import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { DonorController } from './donor.controller';
import { DonorValidation } from './donor.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(DonorValidation.create),
  DonorController.createDonor,
);
router.get('/', DonorController.getAllDonors);
router.get('/:id', DonorController.getDonorById);
router.patch(
  '/:id',
  // auth('ADMIN', 'MODERATOR'),
  validateRequest(DonorValidation.update),
  DonorController.updateDonor,
);
router.delete(
  '/:id',
  auth('ADMIN'),
  DonorController.deleteDonor,
);

export const DonorRoutes = router;
