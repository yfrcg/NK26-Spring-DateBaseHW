import request from './request';
import type { Result, Reservation, ReservationCreateRequest } from '@/types';

export const reservationApi = {
  create: (data: ReservationCreateRequest) =>
    request.post<Result<Reservation>>('/reservations', data),

  listByUser: (userId: number) =>
    request.get<Result<Reservation[]>>(`/reservations/user/${userId}`),

  cancel: (reservationId: number, reason?: string) =>
    request.post<Result<Reservation>>(`/reservations/${reservationId}/cancel`, { reason }),
};
