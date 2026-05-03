import request from './request';
import type { Result, Space } from '@/types';

export const spaceApi = {
  listActive: () =>
    request.get<Result<Space[]>>('/spaces/active'),
};
