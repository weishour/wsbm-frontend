import type { SafeAny } from '@ws/types';

export interface Result<T = SafeAny> {
  code?: number;
  status?: boolean;
  message?: string;
  data?: T;
  error?: Error;
}
