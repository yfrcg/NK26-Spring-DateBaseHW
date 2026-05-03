import request from './request';
import type { Result, CreditTransaction, CreditAdjustRequest } from '@/types';

export const creditApi = {
  listByUser: (userId: number) =>
    request.get<Result<CreditTransaction[]>>(`/credits/${userId}/records`),

  manualAdjust: (userId: number, data: CreditAdjustRequest) =>
    request.post<Result<CreditTransaction>>(`/credits/${userId}/adjust`, data),
};
