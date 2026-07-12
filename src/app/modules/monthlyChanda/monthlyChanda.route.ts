import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { MonthlyChandaController } from './monthlyChanda.controller';
import { MonthlyChandaValidation } from './monthlyChanda.validation';

const router = Router();

router.post('/', auth(Role.ADMIN), validateRequest(MonthlyChandaValidation.create), MonthlyChandaController.createChanda);
router.get('/', auth(Role.ADMIN), MonthlyChandaController.getAllChandas);
router.get('/:id', auth(Role.ADMIN), MonthlyChandaController.getChandaById);
router.patch('/:id', auth(Role.ADMIN), validateRequest(MonthlyChandaValidation.update), MonthlyChandaController.updateChanda);
router.delete('/:id', auth(Role.ADMIN), MonthlyChandaController.deleteChanda);

export const MonthlyChandaRoutes = router;
