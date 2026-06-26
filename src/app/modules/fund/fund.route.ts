import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { FundController } from './fund.controller';
import { TransactionValidation } from './fund.validation';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(TransactionValidation.create),
  FundController.createFund
);

router.get('/', FundController.getAllFunds);

router.get('/:id', FundController.getFundById);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(TransactionValidation.update),
  FundController.updateFund
);

router.delete('/:id', auth(Role.ADMIN), FundController.deleteFund);

export const FundRoutes = router;