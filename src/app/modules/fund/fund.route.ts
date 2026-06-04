import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { FundController } from './fund.controller';
import { FundValidation } from './fund.validation';

const router = Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(FundValidation.create),
  FundController.createFund
);
router.get('/', FundController.getAllFunds);
router.get('/:id', FundController.getFundById);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(FundValidation.update),
  FundController.updateFund
);
router.delete('/:id', auth('admin'), FundController.deleteFund);

export const FundRoutes = router;
