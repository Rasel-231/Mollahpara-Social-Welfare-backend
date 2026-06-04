export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
