import request from './request';
import type { Result, UserAccount, Transaction, RechargeRequest } from '@/types';

export const accountApi = {
  getAccount: (userId: number) =>
    request.get<Result<UserAccount>>(`/users/${userId}/account`),

  recharge: (userId: number, data: RechargeRequest) =>
    request.post<Result<UserAccount>>(`/users/${userId}/account/recharge`, data),

  getTransactions: (userId: number) =>
    request.get<Result<Transaction[]>>(`/users/${userId}/account/transactions`),
};
