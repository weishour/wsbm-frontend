import { Injectable } from '@angular/core';
import { HttpContextToken } from '@angular/common/http';
import { HttpContextType } from '@ws/interfaces';
import { ConfigProvider } from 'app/core/config';

@Injectable({ providedIn: 'root' })
export class ContextToken {
  constructor(private _configProvider: ConfigProvider) {}

  /** 超时时间 */
  TIMEOUT = new HttpContextToken<number>(() => this._configProvider.TIMEOUT);

  /** 重试次数 */
  RETRY_COUNT = new HttpContextToken<number>(() => this._configProvider.RETRY_COUNT);

  /** 重试延迟 */
  RETRY_DELAY = new HttpContextToken<number>(() => this._configProvider.RETRY_DELAY);

  /** 请求额外配置 */
  HTTP_CONTEXT = new HttpContextToken<HttpContextType>(() => {
    return {
      toast: this._configProvider.HTTP_TOAST,
    };
  });
}
