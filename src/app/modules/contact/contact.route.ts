import { Router } from 'express';
import { Role } from '@prisma/client';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { ContactController } from './contact.controller';
import { ContactValidation } from './contact.validation';

const router = Router();

router.post(
    '/create',
    validateRequest(ContactValidation.create),
    ContactController.createContact
);
router.get('/', auth(Role.ADMIN), ContactController.getAllContacts);
router.get('/:id', auth(Role.ADMIN), ContactController.getContactById);
router.patch(
    '/:id',
    auth(Role.ADMIN),
    validateRequest(ContactValidation.update),
    ContactController.updateContact
);
router.delete('/:id', auth(Role.ADMIN), ContactController.deleteContact);

export const ContactRoutes = router;