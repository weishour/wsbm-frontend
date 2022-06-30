import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import type { SafeAny } from '@ws/types';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * 构造函数
   */
  constructor(private _authService: AuthService) {}

  /**
   * 拦截
   * @param {HttpRequest<SafeAny>} req
   * @param {HttpHandler} next
   */
  intercept(req: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
    // 克隆请求对象
    let newReq = req.clone();

    // 如果访问令牌没有过期，则添加Authorization头。如果访问令牌过期，这将迫使服务器为受保护的API路由返回一个
    // "401 Unauthorized"响应，我们的响应拦截器将从本地存储捕获并删除访问令牌，同时将用户从应用程序注销
    if (this._authService.accessToken) {
      let token = this._authService.accessToken;

      // 若请求为刷新Token请求，令牌则为refreshToken
      if (['/auth/refresh'].some((url) => req.url.includes(url))) {
        token = this._authService.refreshToken;
      }

      newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    // 将克隆请求发送到下一个处理程序
    return next.handle(newReq);
  }
}
