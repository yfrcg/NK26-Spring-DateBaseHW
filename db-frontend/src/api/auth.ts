import request from './request';
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  Result,
  User,
} from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    request.post<Result<AuthResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    request.post<Result<AuthResponse>>('/auth/register', data),

  me: () =>
    request.get<Result<User>>('/auth/me'),

  changePassword: (data: ChangePasswordRequest) =>
    request.post<Result<User>>('/auth/change-password', data),

  logout: () =>
    request.post<Result<null>>('/auth/logout'),
};
