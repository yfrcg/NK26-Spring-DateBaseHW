import request from './request';
import type { Result, DashboardVO, TopSpaceVO, CreditEventStatVO } from '@/types';

export const reportApi = {
  getDashboard: () =>
    request.get<Result<DashboardVO>>('/reports/dashboard'),

  getTopSpaces: (limit: number = 5) =>
    request.get<Result<TopSpaceVO[]>>('/reports/top-spaces', { params: { limit } }),

  getCreditEvents: () =>
    request.get<Result<CreditEventStatVO[]>>('/reports/credit-events'),
};
