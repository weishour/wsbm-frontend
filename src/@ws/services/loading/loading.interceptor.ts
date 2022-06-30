import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { WsLoadingService } from '@ws/services/loading/loading.service';

@Injectable()
export class WsLoadingInterceptor implements HttpInterceptor {
  handleRequestsAutomatically: boolean;

  /**
   * 构造函数
   */
  constructor(private _wsLoadingService: WsLoadingService) {
    // 订阅自动模式
    this._wsLoadingService.auto$.subscribe(value => {
      this.handleRequestsAutomatically = value;
    });
  }

  /**
   * 拦截
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 如果“自动”模式已关闭，则无需执行任何操作
    if (!this.handleRequestsAutomatically) {
      return next.handle(req);
    }

    // 设置加载状态为true
    this._wsLoadingService._setLoadingStatus(true, req.url);

    return next.handle(req).pipe(
      finalize(() => {
        // 如果出现错误或请求完成，则将状态设置为false
        this._wsLoadingService._setLoadingStatus(false, req.url);
      }),
    );
  }
}
