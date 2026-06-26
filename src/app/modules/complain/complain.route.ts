import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { ComplainController } from './complain.controller';
import { ComplainValidation } from './complain.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(ComplainValidation.create),
  ComplainController.createComplain
);
router.get('/', auth('ADMIN'), ComplainController.getAllComplains);
router.get('/:id', auth('ADMIN'), ComplainController.getSingleComplain);
router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(ComplainValidation.update),
  ComplainController.updateComplain
);
router.delete('/:id', auth('ADMIN'), ComplainController.deleteComplain);

export const ComplainRoutes = router;
