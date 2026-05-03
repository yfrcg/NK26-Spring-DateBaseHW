import request from './request';
import type { Result, SpaceRuntimeStatus } from '@/types';

export const runtimeApi = {
  listSpaces: () =>
    request.get<Result<SpaceRuntimeStatus[]>>('/runtime/spaces'),
};
