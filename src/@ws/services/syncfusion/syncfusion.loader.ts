import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '@ws/services/storage';
import { AppConfig } from 'app/core/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncfusionLoader {
  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient, private _storageService: StorageService) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取主题样式
   *
   * @param theme
   */
  getTheme(theme: string): Observable<string> {
    const themeName = theme.split('-')[1];
    const isDark = this._storageService.get<AppConfig>('system-config').isDark;
    const dark = isDark ? '-dark' : '';

    return this._httpClient.get(`assets/styles/syncfusion/${themeName}-material${dark}.min.css`, {
      responseType: 'text',
    });
  }
}
