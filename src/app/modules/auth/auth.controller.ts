import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginMember(req.body);


  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: result,
  });
});


const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.refreshAccessToken(
      req.body.refreshToken
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Access token refreshed successfully',
      data: result,
    });
  }
);

const logout = catchAsync(async (req: Request, res: Response) => {
  await AuthService.logout(req.body.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const memberId = (req as any).user.id;
  await AuthService.changePassword(memberId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
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
  const userId = (req as any).user.id;
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
