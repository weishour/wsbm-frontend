import { Injectable } from '@angular/core';
import { Result } from '@ws/interfaces';
import { WsHttpService } from '@ws/services/http';
import { Observable, switchMap, of } from 'rxjs';
import { SiteInfo } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  /**
   * 构造函数
   */
  constructor(private _wsHttpService: WsHttpService) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取站点信息
   */
  getSiteInfo(url: string): Observable<SiteInfo> {
    return this._wsHttpService.get<Result<SiteInfo>>('site', { url }).pipe(
      switchMap((result) => {
        const siteInfo: SiteInfo = result.data;
        return of(siteInfo);
      }),
    );
  }
}
