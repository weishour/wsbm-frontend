import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpContextType } from '@ws/interfaces';
import { ContextToken } from '@ws/services/http/context.token';
import { ConfigProvider } from 'app/core/config';
import { delay, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import type { SafeAny, WsHttpOptions, WsHttpHeaders, HttpObserve, WsResponseType } from '@ws/types';

/**
 * 封装WsHttpService
 * + 优化HttpClient在参数上便利性
 */
@Injectable({ providedIn: 'root' })
export class WsHttpService {
  private loadCount = 0;
  /** 请求额外默认配置 */
  private defaultContext: HttpContextType;

  constructor(
    private http: HttpClient,
    private _configProvider: ConfigProvider,
    private _contextToken: ContextToken,
  ) {
    this.defaultContext = {
      toast: this._configProvider.HTTP_TOAST,
    };
  }

  /**
   * 获取是否正在加载中
   */
  get loading(): boolean {
    return this.loadCount > 0;
  }

  /**
   * 获取当前加载中的数量
   */
  get loadingCount(): number {
    return this.loadCount;
  }

  /**
   * 解析参数
   * @param {SafeAny} params
   * @returns
   */
  parseParams(params: SafeAny): HttpParams {
    const newParams: SafeAny = {};
    if (params instanceof HttpParams) {
      return params;
    }

    Object.keys(params).forEach((key) => {
      let _data = params[key];
      // // 忽略空值
      // if (this.cog.nullValueHandling === 'ignore' && _data == null) return;
      // // 将时间转化为：时间戳 (秒)
      // if (this.cog.dateValueHandling === 'timestamp' && _data instanceof Date) {
      //   _data = _data.valueOf();
      // }
      newParams[key] = _data;
    });
    return new HttpParams({ fromObject: newParams });
  }

  /**
   * url附加参数
   * @param url
   * @param params
   * @returns
   */
  appliedUrl(url: string, params?: SafeAny): string {
    if (!params) return url;
    url += ~url.indexOf('?') ? '' : '?';
    const arr: string[] = [];
    Object.keys(params).forEach((key) => {
      arr.push(`${key}=${params[key]}`);
    });
    return url + arr.join('&');
  }

  private setCount(count: number): void {
    Promise.resolve(null).then(() => (this.loadCount = count <= 0 ? 0 : count));
  }

  private push(): void {
    this.setCount(++this.loadCount);
  }

  private pop(): void {
    this.setCount(--this.loadCount);
  }

  /**
   * 清空加载中
   */
  cleanLoading(): void {
    this.setCount(0);
  }

  /**
   * GET
   * @param {string} url
   * @param {SafeAny} params
   * @param {HttpContextType} context
   * @param options
   * @returns
   */
  get<T = SafeAny>(
    url: string,
    params?: SafeAny,
    context?: HttpContextType,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request<T>('GET', url, context, { params, ...options });
  }

  /**
   * POST
   * @param {string} url
   * @param {SafeAny} body
   * @param {HttpContextType} context
   * @param {SafeAny} params
   * @param options
   * @returns
   */
  post<T = SafeAny>(
    url: string,
    body?: SafeAny,
    context?: HttpContextType,
    params?: SafeAny,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request('POST', url, context, { body, params, ...options });
  }

  /**
   * PATHCH
   * @param {string} url
   * @param {SafeAny} body
   * @param {HttpContextType} context
   * @param {SafeAny} params
   * @param options
   * @returns
   */
  put<T = SafeAny>(
    url: string,
    body?: SafeAny,
    context?: HttpContextType,
    params?: SafeAny,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request('PATHCH', url, context, { body, params, ...options });
  }

  /**
   * DELETE
   * @param {string} url
   * @param {SafeAny} params
   * @param {HttpContextType} context
   * @param options
   * @returns
   */
  delete<T = SafeAny>(
    url: string,
    params?: SafeAny,
    context?: HttpContextType,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request<T>('DELETE', url, context, { params, ...options });
  }

  /**
   * HEAD
   * @param {string} url
   * @param {SafeAny} params
   * @param {HttpContextType} context
   * @param options
   * @returns
   */
  head<T = SafeAny>(
    url: string,
    params?: SafeAny,
    context?: HttpContextType,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request<T>('HEAD', url, context, { params, ...options });
  }

  /**
   * OPTIONS
   * @param {string} url
   * @param {SafeAny} body
   * @param {HttpContextType} context
   * @param {SafeAny} params
   * @param options
   * @returns
   */
  options<T = SafeAny>(
    url: string,
    body?: SafeAny,
    context?: HttpContextType,
    params?: SafeAny,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request('OPTIONS', url, context, { body, params, ...options });
  }

  /**
   * PATHCH
   * @param {string} url
   * @param {SafeAny} body
   * @param {HttpContextType} context
   * @param {SafeAny} params
   * @param options
   * @returns
   */
  patch<T = SafeAny>(
    url: string,
    body?: SafeAny,
    context?: HttpContextType,
    params?: SafeAny,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request('PATHCH', url, context, { body, params, ...options });
  }

  /**
   * FORM
   * @param {string} url
   * @param {SafeAny} body
   * @param {HttpContextType} context
   * @param {SafeAny} params
   * @param options
   * @returns
   */
  form<T = SafeAny>(
    url: string,
    body?: SafeAny,
    context?: HttpContextType,
    params?: SafeAny,
    options: WsHttpOptions = {},
  ): Observable<T> {
    return this.request('POST', url, context, {
      body,
      params,
      ...options,
      headers: {
        'content-type': `application/x-www-form-urlencoded`,
      },
    });
  }

  /**
   * JSONP
   * @param callbackParam CALLBACK值，默认：JSONP_CALLBACK
   */
  jsonp<T = SafeAny>(
    url: string,
    params?: SafeAny,
    callbackParam: string = 'JSONP_CALLBACK',
  ): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.push()),
      switchMap(() => this.http.jsonp<T>(this.appliedUrl(url, params), callbackParam)),
      finalize(() => this.pop()),
    );
  }

  /**
   * REQUEST
   * @param {string} method
   * @param {string} url
   * @param {HttpContextType} context
   * @param options
   * @returns
   */
  request<R = SafeAny>(
    method: string,
    url: string,
    context: HttpContextType = this.defaultContext,
    options: {
      body?: SafeAny;
      headers?: WsHttpHeaders;
      params?: SafeAny;
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: WsResponseType;
      withCredentials?: boolean;
      context?: HttpContext;
    } = {},
  ): Observable<R> {
    // 参数处理
    if (options.params) options.params = this.parseParams(options.params);

    // 请求额外配置
    options.context = new HttpContext().set(this._contextToken.HTTP_CONTEXT, {
      toast: context.toast,
    });

    return of(null).pipe(
      delay(0),
      tap(() => this.push()),
      switchMap(() => this.http.request(method, url, options)),
      finalize(() => this.pop()),
    );
  }
}
