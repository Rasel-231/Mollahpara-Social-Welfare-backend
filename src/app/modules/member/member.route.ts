import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { MemberController } from './member.controller';
import { MemberValidation } from './member.validation';

const router = Router();

router.post(
  '/create',
  validateRequest(MemberValidation.create),
  MemberController.createMember
);
router.get('/', MemberController.getAllMembers);
router.get('/:id', MemberController.getMemberById);
router.patch(
  '/:id', validateRequest(MemberValidation.update),
  MemberController.updateMember
);
router.delete('/:id', MemberController.deleteMember);

export const MemberRoutes = router;
