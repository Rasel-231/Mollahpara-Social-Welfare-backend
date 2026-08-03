import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';
import AppError from '../../../errors/AppError';

const cookieOptions: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none' | 'strict';
} = config.cookie;

const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: config.jwt.access_token_max_age,
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: config.jwt.refresh_token_max_age,
};

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginMember(req.body);

  res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: { member: result.member },
  });
});

const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshTokenValue = req.cookies?.refreshToken;

    if (!refreshTokenValue) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Refresh token not found in cookies',
      });
    }

    const result = await AuthService.refreshAccessToken(refreshTokenValue);

    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);

    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Access token refreshed successfully',
      data: {},
    });
  }
);

const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenValue = req.cookies?.refreshToken;

  if (refreshTokenValue) {
    await AuthService.logout(refreshTokenValue);
  }

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user?.id;

  if (!memberId) {
    throw new AppError(401, 'You are not authorized');
  }

  await AuthService.changePassword(memberId, req.body);

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      'If an account with that email exists, a password reset link has been sent',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully',
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, 'You are not authorized');
  }

  const result = await AuthService.getMyProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

export const AuthController = {
  login,
  refreshAccessToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getMyProfile,
};
