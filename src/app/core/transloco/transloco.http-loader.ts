import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取翻译
   *
   * @param lang
   */
  getTranslation(lang: string): Observable<Translation> {
    return this._httpClient.get<Translation>(`assets/i18n/${lang}.json`);
  }
}
