import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { CostingController } from './costing.controller';
import { costingValidation } from './costing.validation';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(costingValidation.create),
  CostingController.createCosting
);

router.get('/', auth(Role.ADMIN), CostingController.getAllCostings);

router.get('/:id', auth(Role.ADMIN), CostingController.getCostingById);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(costingValidation.update),
  CostingController.updateCosting
);

router.delete('/:id', auth(Role.ADMIN), CostingController.deleteCosting);

export const CostingRoutes = router;
