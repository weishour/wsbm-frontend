import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigProvider {
  public readonly DEBUG = true;
  public readonly PROD_API = 'https://wsbm.weishour.com/api/';
  public readonly AUTH_KEY = 'WS_AUTH';
  public readonly DEBUG_KEY = 'WS_DEBUG';

  /** 超时时间（30秒） */
  public readonly TIMEOUT: number = 30 * 1000;

  /** 重试次数 */
  public readonly RETRY_COUNT: number = 0;

  /** 重试延迟（2秒） */
  public readonly RETRY_DELAY: number = 2 * 1000;

  /** 请求toast */
  public readonly HTTP_TOAST: boolean = true;
}
