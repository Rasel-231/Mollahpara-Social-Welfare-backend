import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many token refresh attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many password reset requests. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/login',
  loginLimiter,
  validateRequest(AuthValidation.login),
  AuthController.login
);
router.post(
  '/refresh-token',
  refreshTokenLimiter,
  AuthController.refreshAccessToken
);
router.post('/logout', AuthController.logout);
router.post(
  '/change-password',
  auth(),
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword
);
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateRequest(AuthValidation.forgotPassword),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPassword),
  AuthController.resetPassword
);

router.get('/profile', auth(), AuthController.getMyProfile);

export const AuthRoutes = router;
