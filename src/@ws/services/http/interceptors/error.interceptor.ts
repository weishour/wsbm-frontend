import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
  HttpErrorResponse,
} from '@angular/common/http';
import { Result } from '@ws/interfaces';
import { WsMessageService } from '@ws/services/message';
import { ContextToken } from '@ws/services/http';
import { AuthService } from 'app/core/auth';
import { NavigationService } from 'app/core/navigation';
import {
  BehaviorSubject,
  catchError,
  filter,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { omit, startsWith } from 'lodash-es';
import type { SafeAny } from '@ws/types';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private _refreshTokenEnabled = true;
  private _refreshToking = false;
  private _refreshToken$: BehaviorSubject<SafeAny> = new BehaviorSubject<SafeAny>(null);

  constructor(
    private _wsMessageService: WsMessageService,
    private _contextToken: ContextToken,
    private _authService: AuthService,
    private _navigationService: NavigationService,
  ) {}

  /**
   * 刷新token请求处理
   * @param {HttpResponseBase} event
   * @param {HttpRequest<SafeAny>} req
   * @param {HttpHandler} next
   * @returns
   */
  private refreshToken(
    event: HttpResponseBase,
    req: HttpRequest<SafeAny>,
    next: HttpHandler,
  ): Observable<SafeAny> {
    const err = event['error'];
    if (err && err.message.includes('其他地方登录')) {
      this._navigationService.toLogin(err.message);
      return throwError(() => event);
    }

    // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
    if (['/auth/refresh'].some((url) => req.url.includes(url))) {
      this._navigationService.toLogin(err.message);
      return throwError(() => event);
    }

    // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中
    // 后续所有请求转入等待状态，直至结果返回后再重新发起请求
    if (this._refreshToking) {
      return this._refreshToken$.pipe(
        filter((v) => !!v),
        take(1),
        switchMap(() => next.handle(req)),
      );
    }

    // 3、调用刷新Token
    this._refreshToking = true;
    this._refreshToken$.next(null);

    return this._authService.refreshTokenRequest().pipe(
      switchMap((result) => {
        // 通知后续请求继续执行
        this._refreshToking = false;
        this._refreshToken$.next(result);

        // 重新发起请求
        return next.handle(req);
      }),
      catchError((error) => {
        this._refreshToking = false;
        return throwError(() => error);
      }),
    );
  }

  /**
   * 请求状态处理
   * @param {HttpResponseBase} event
   * @param {HttpRequest<SafeAny>} req
   * @param {HttpHandler} next
   * @returns
   */
  private handleData(
    event: HttpResponseBase,
    req: HttpRequest<SafeAny>,
    next: HttpHandler,
  ): Observable<SafeAny> {
    // 请求上下文额外配置
    const httpContext = req.context.get(this._contextToken.HTTP_CONTEXT);

    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
      case 201:
        const { url } = req;
        // 排除请求本地静态资源 & 请求地址以api开头为Mock
        if (
          !startsWith(url, 'assets') &&
          !startsWith(url, 'api/') &&
          event instanceof HttpResponse
        ) {
          // 后端服务响应结果
          const body: Result = event.body;

          // 请求结果状态处理
          if (body && body?.status) {
            // 忽略 Blob 文件体
            if (body instanceof Blob) {
              return of(event);
            }

            // toast的成功提示
            if (httpContext.toast) this._wsMessageService.toast('success', body?.message);

            // 更改请求响应
            const newReq = event.clone<Result>({ body: { ...omit(body, ['time', 'path']) } });

            // 将请求发送到下一个处理程序
            return of(newReq);
          } else {
            // 状态码成功 & 后端状态失败
            return throwError(() => event);
          }
        }
        break;
      case 401:
        if (event instanceof HttpErrorResponse && this._refreshTokenEnabled) {
          return this.refreshToken(event, req, next);
        }
        this._navigationService.toLogin();
        break;
      case 403:
        this._navigationService.goTo(`/error/${event.status}`);
        break;
      case 500:
      case 400:
      case 404:
      default:
        if (event instanceof HttpErrorResponse) {
          return throwError(() => event);
        }
        break;
    }

    // 将请求发送到下一个处理程序
    return of(event);
  }

  /**
   * 拦截
   * @param {HttpRequest<SafeAny>} req
   * @param {HttpHandler} next
   */
  intercept(req: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
    // 请求上下文额外配置
    const httpContext = req.context.get(this._contextToken.HTTP_CONTEXT);

    return next.handle(req).pipe(
      mergeMap((event) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleData(event, req, next);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // 处理客户端发生的网络错误
          this._wsMessageService.toast('error', '未知错误，服务异常或CORS不支持', {
            autoClose: false,
            dismissible: true,
          });
        } else {
          // 请求失败处理、服务端错误（异常或者语法等）
          return this.handleData(error, req, next);
        }

        // 请求失败包含错误信息
        return throwError(() => error);
      }),
    );
  }
}
