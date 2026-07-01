import { Router } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { VideoController } from './video.controller';
import { VideoValidation } from './video.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(VideoValidation.create),
  VideoController.createVideo,
);

router.get('/', VideoController.getAllVideos);
router.get('/:id', VideoController.getVideoById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(VideoValidation.update),
  VideoController.updateVideo,
);

router.delete('/:id', auth('ADMIN'), VideoController.deleteVideo);

export const VideoRoutes = router;
