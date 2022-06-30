import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root',
})
export class WsPlatformService {
  osName = 'os-unknown';

  /**
   * 构造函数
   */
  constructor(private _platform: Platform) {
    // 如果平台不是浏览器，则立即返回
    if (!this._platform.isBrowser) {
      return;
    }

    // Windows
    if (navigator.userAgent.includes('Win')) {
      this.osName = 'os-windows';
    }

    // Mac OS
    if (navigator.userAgent.includes('Mac')) {
      this.osName = 'os-mac';
    }

    // Unix
    if (navigator.userAgent.includes('X11')) {
      this.osName = 'os-unix';
    }

    // Linux
    if (navigator.userAgent.includes('Linux')) {
      this.osName = 'os-linux';
    }

    // iOS
    if (this._platform.IOS) {
      this.osName = 'os-ios';
    }

    // Android
    if (this._platform.ANDROID) {
      this.osName = 'os-android';
    }
  }
}
