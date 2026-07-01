import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { FundController } from './fund.controller';
import { fundValidation } from './fund.validation';


const router = Router();

router.post(
  '/donation',
  validateRequest(fundValidation.create),
  FundController.createFund
);

router.get('/', auth(Role.ADMIN), FundController.getAllFunds);

router.get('/:id', auth(Role.ADMIN), FundController.getFundById);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(fundValidation.update),
  FundController.updateFund
);

router.delete('/:id', auth(Role.ADMIN), FundController.deleteFund);

export const FundRoutes = router;