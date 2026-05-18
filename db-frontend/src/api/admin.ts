import request from './request';
import type { Result, User, Space, Reservation, PricingPolicy, CreditAdjustRequest } from '@/types';

export const adminApi = {
  user: {
    list: () =>
      request.get<Result<User[]>>('/admin/users'),
    suspend: (userId: number) =>
      request.post<Result<User>>(`/admin/users/${userId}/suspend`),
    activate: (userId: number) =>
      request.post<Result<User>>(`/admin/users/${userId}/activate`),
  },
  space: {
    list: () =>
      request.get<Result<Space[]>>('/admin/spaces'),
    disable: (spaceId: number) =>
      request.post<Result<Space>>(`/admin/spaces/${spaceId}/disable`),
    activate: (spaceId: number) =>
      request.post<Result<Space>>(`/admin/spaces/${spaceId}/activate`),
    maintenance: (spaceId: number) =>
      request.post<Result<Space>>(`/admin/spaces/${spaceId}/maintenance`),
  },
  reservation: {
    list: () =>
      request.get<Result<Reservation[]>>('/admin/reservations'),
    cancel: (reservationId: number, reason?: string) =>
      request.post<Result<Reservation>>(`/admin/reservations/${reservationId}/cancel`, { reason }),
  },
  credit: {
    adjust: (userId: number, data: CreditAdjustRequest) =>
      request.post<Result<{ creditScore: number }>>(`/admin/credits/${userId}/adjust`, data),
  },
  policy: {
    list: () =>
      request.get<Result<PricingPolicy[]>>('/admin/policies'),
    create: (data: Partial<PricingPolicy>) =>
      request.post<Result<PricingPolicy>>('/admin/policies', data),
    update: (policyId: number, data: Partial<PricingPolicy>) =>
      request.put<Result<PricingPolicy>>(`/admin/policies/${policyId}`, data),
    delete: (policyId: number) =>
      request.delete<Result<PricingPolicy>>(`/admin/policies/${policyId}`),
    enable: (policyId: number) =>
      request.post<Result<PricingPolicy>>(`/admin/policies/${policyId}/enable`),
    disable: (policyId: number) =>
      request.post<Result<PricingPolicy>>(`/admin/policies/${policyId}/disable`),
  },
};
