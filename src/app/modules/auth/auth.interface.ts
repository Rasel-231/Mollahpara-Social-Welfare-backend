export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}
