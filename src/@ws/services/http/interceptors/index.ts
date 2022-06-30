import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestInterceptor } from './request.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { LoggingInterceptor } from './logging.interceptor';

/* 由外而内的Http拦截器提供程序 */
export const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
];
