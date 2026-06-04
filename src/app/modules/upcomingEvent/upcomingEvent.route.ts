import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { UpcomingEventController } from './upcomingEvent.controller';
import { UpcomingEventValidation } from './upcomingEvent.validation';

const router = Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(UpcomingEventValidation.create),
  UpcomingEventController.createEvent
);
router.get('/', UpcomingEventController.getAllEvents);
router.get('/:id', UpcomingEventController.getEventById);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(UpcomingEventValidation.update),
  UpcomingEventController.updateEvent
);
router.delete('/:id', auth('admin'), UpcomingEventController.deleteEvent);

export const UpcomingEventRoutes = router;
