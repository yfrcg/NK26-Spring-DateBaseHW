import request from './request';
import type { Result, UsageSession } from '@/types';

export const sessionApi = {
  checkIn: (reservationId: number) =>
    request.post<Result<UsageSession>>(`/sessions/${reservationId}/check-in`),

  tempHold: (reservationId: number) =>
    request.post<Result<UsageSession>>(`/sessions/${reservationId}/temp-hold`),

  resume: (reservationId: number) =>
    request.post<Result<UsageSession>>(`/sessions/${reservationId}/resume`),

  checkOut: (reservationId: number) =>
    request.post<Result<UsageSession>>(`/sessions/${reservationId}/check-out`),

  getByReservation: (reservationId: number) =>
    request.get<Result<UsageSession>>(`/sessions/reservation/${reservationId}`),
};
