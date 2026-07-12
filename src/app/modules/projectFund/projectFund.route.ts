import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { ProjectFundController } from './projectFund.controller';
import { ProjectFundValidation } from './projectFund.validation';

const router = Router();

router.post('/', auth(Role.ADMIN), validateRequest(ProjectFundValidation.create), ProjectFundController.createFund);
router.get('/', auth(Role.ADMIN), ProjectFundController.getAllFunds);
router.get('/:id', auth(Role.ADMIN), ProjectFundController.getFundById);
router.patch('/:id', auth(Role.ADMIN), validateRequest(ProjectFundValidation.update), ProjectFundController.updateFund);
router.delete('/:id', auth(Role.ADMIN), ProjectFundController.deleteFund);

export const ProjectFundRoutes = router;
