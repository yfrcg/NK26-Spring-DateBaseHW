import request from './request';
import type { Result, User, UserCreateRequest } from '@/types';

export const userApi = {
  createUser: (data: UserCreateRequest) =>
    request.post<Result<User>>('/users', data),

  listUsers: () =>
    request.get<Result<User[]>>('/users'),

  getById: (id: number) =>
    request.get<Result<User>>(`/users/${id}`),
};
