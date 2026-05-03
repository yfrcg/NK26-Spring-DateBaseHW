import request from './request';
import type { Result, BillingOrder } from '@/types';

export const billingApi = {
  getByReservation: (reservationId: number) =>
    request.get<Result<BillingOrder>>(`/bills/reservation/${reservationId}`),

  listByUser: (userId: number) =>
    request.get<Result<BillingOrder[]>>(`/bills/user/${userId}`),
};
