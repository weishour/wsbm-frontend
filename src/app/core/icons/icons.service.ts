import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import type { SafeAny } from '@ws/types';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  private _icons: BehaviorSubject<SafeAny> = new BehaviorSubject(null);

  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ 访问器
  // -----------------------------------------------------------------------------------------------------

  /**
   * 获取图标
   */
  get icons(): Observable<SafeAny> {
    return this._icons.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ 公共方法
  // -----------------------------------------------------------------------------------------------------

  /**
   * 获取图标
   *
   * @param url
   */
  getIcons(url: string = 'label-classify'): Observable<SafeAny> {
    url = 'api/ui/icons/' + url;

    return this._httpClient.get(url).pipe(
      tap((response: SafeAny) => {
        this._icons.next(response);
      }),
    );
  }
}
