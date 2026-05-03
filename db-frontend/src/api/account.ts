import request from './request';
import type { Result, UserAccount, AccountTransaction, RechargeRequest } from '@/types';

export const accountApi = {
  getAccount: (userId: number) =>
    request.get<Result<UserAccount>>(`/accounts/${userId}`),

  recharge: (userId: number, data: RechargeRequest) =>
    request.post<Result<UserAccount>>(`/accounts/${userId}/recharge`, data),

  listTransactions: (userId: number) =>
    request.get<Result<AccountTransaction[]>>(`/accounts/${userId}/transactions`),
};
