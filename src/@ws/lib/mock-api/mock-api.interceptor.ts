import { Inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { WS_MOCK_API_DEFAULT_DELAY } from '@ws/lib/mock-api/mock-api.constants';
import { WsMockApiService } from '@ws/lib/mock-api/mock-api.service';

@Injectable({
  providedIn: 'root',
})
export class WsMockApiInterceptor implements HttpInterceptor {
  /**
   * 构造函数
   */
  constructor(
    @Inject(WS_MOCK_API_DEFAULT_DELAY) private _defaultDelay: number,
    private _wsMockApiService: WsMockApiService,
  ) {}

  /**
   * 拦截
   *
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 尝试获取请求处理程序
    const { handler, urlParams } = this._wsMockApiService.findHandler(
      request.method.toUpperCase(),
      request.url,
    );

    // 如果请求处理程序不存在，则传递
    if (!handler) {
      return next.handle(request);
    }

    // 在处理程序上设置截获的请求
    handler.request = request;

    // 在处理程序上设置url参数
    handler.urlParams = urlParams;

    // 订阅响应函数observable
    return handler.response.pipe(
      delay(handler.delay ?? this._defaultDelay ?? 0),
      switchMap(response => {
        // 如果没有响应数据，则抛出错误响应
        if (!response) {
          response = new HttpErrorResponse({
            error: 'NOT FOUND',
            status: 404,
            statusText: 'NOT FOUND',
          });

          return throwError(() => response);
        }

        // 解析响应数据
        const data = {
          status: response[0],
          body: response[1],
        };

        // 如果状态码在200到300之间，则返回一个成功响应
        if (data.status >= 200 && data.status < 300) {
          response = new HttpResponse({
            body: data.body,
            status: data.status,
            statusText: 'OK',
          });

          return of(response);
        }

        // 对于其他状态码，抛出一个错误响应
        response = new HttpErrorResponse({
          error: data.body.error,
          status: data.status,
          statusText: 'ERROR',
        });

        return throwError(() => response);
      }),
    );
  }
}
