import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Result } from '@ws/interfaces';
import { ContextToken } from '@ws/services/http';
import { WsMessageService } from '@ws/services/message';
import { environment } from 'environments/environment';
import { catchError, Observable, retry, shareReplay, throwError, timeout } from 'rxjs';
import { startsWith } from 'lodash-es';
import type { SafeAny, ObjectHttpHeaders } from '@ws/types';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  /** 前置url */
  baseUrl = '';

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _contextToken: ContextToken,
    private _wsMessageService: WsMessageService,
  ) {}

  /**
   * 添加额外请求头参数
   * @param {HttpHeaders} headers
   * @returns
   */
  private getAdditionalHeaders(headers?: HttpHeaders): ObjectHttpHeaders {
    const res: ObjectHttpHeaders = {},
      lang = this._document.documentElement.lang;

    if (!headers?.has('Accept-Language') && lang) {
      res['Accept-Language'] = lang;
    }

    return res;
  }

  /**
   * 拦截
   * @param {HttpRequest<SafeAny>} req
   * @param {HttpHandler} next
   */
  intercept(req: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
    let { url } = req;

    // 请求上下文
    const time = req.context.get(this._contextToken.TIMEOUT),
      count = req.context.get(this._contextToken.RETRY_COUNT),
      delay = req.context.get(this._contextToken.RETRY_DELAY),
      httpContext = req.context.get(this._contextToken.HTTP_CONTEXT);

    // 排除请求本地静态资源 & 请求地址以api开头为Mock
    if (!startsWith(url, 'assets') && !startsWith(url, 'api/')) {
      this.baseUrl = environment.BASE_API;
    } else {
      this.baseUrl = '';
    }

    // 忽略服务端前缀
    if (this.baseUrl !== '' && url.startsWith('http')) this.baseUrl = '';

    // 统一添加服务端前缀
    url = this.baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url;

    // 克隆请求
    const newReq = req.clone({
      url: this.baseUrl + url,
      setHeaders: this.getAdditionalHeaders(req.headers),
    });

    // 将克隆请求发送到下一个处理程序
    return next.handle(newReq).pipe(
      timeout(time),
      retry({ count, delay }),
      catchError((error: HttpErrorResponse) => {
        const body: Result = error.error;

        // toast的错误提示
        if (httpContext.toast && body?.message) this._wsMessageService.toast('error', body.message);

        return throwError(() => error);
      }),
      shareReplay(1),
    );
  }
}
