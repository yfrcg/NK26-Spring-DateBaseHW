import request from './request';
import type { Result, Location, LocationTreeVO, LocationCreateRequest, Space } from '@/types';

export const locationApi = {
  getTree: () =>
    request.get<Result<LocationTreeVO[]>>('/locations/tree'),

  listSpacesByLocation: (locationId: number) =>
    request.get<Result<Space[]>>(`/locations/${locationId}/spaces`),

  create: (data: LocationCreateRequest) =>
    request.post<Result<Location>>('/locations', data),
};
