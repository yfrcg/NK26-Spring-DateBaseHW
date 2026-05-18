import request from './request';
import type { Result, CreditTransaction, CreditAdjustRequest } from '@/types';

export const creditApi = {
  getScore: (userId: number) =>
    request.get<Result<number>>(`/users/${userId}/credits`),

  listTransactions: (userId: number) =>
    request.get<Result<CreditTransaction[]>>(`/users/${userId}/credits/transactions`),

  manualAdjust: (userId: number, data: CreditAdjustRequest) =>
    request.post<Result<{ creditScore: number }>>(`/users/${userId}/credits/adjust`, data),
};
