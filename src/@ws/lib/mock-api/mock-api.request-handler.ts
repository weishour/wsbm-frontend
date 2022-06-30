import { HttpRequest } from '@angular/common/http';
import { Observable, of, take, throwError } from 'rxjs';
import { WsMockApiReplyCallback } from '@ws/lib/mock-api/mock-api.types';

export class WsMockApiHandler {
  request!: HttpRequest<any>;
  urlParams!: { [key: string]: string };

  // Private
  private _reply: WsMockApiReplyCallback = undefined;
  private _replyCount = 0;
  private _replied = 0;

  /**
   * 构造函数
   */
  constructor(public url: string, public delay?: number) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 请求回调访问器
   */
  get response(): Observable<any> {
    // 如果已达到执行限制，则抛出错误
    if (this._replyCount > 0 && this._replyCount <= this._replied) {
      return throwError(() => 'Execution limit has been reached!');
    }

    // 如果没有设置响应回调，则抛出一个错误
    if (!this._reply) {
      return throwError(() => 'Response callback function does not exist!');
    }

    // 如果没有设置请求，则抛出一个错误
    if (!this.request) {
      return throwError(() => 'Request does not exist!');
    }

    // 增加回复数
    this._replied++;

    // 执行回复回调
    const replyResult = this._reply({
      request: this.request,
      urlParams: this.urlParams,
    });

    // 如果reply回调的结果是一个可观察对象…
    if (replyResult instanceof Observable) {
      // 按原样返回结果
      return replyResult.pipe(take(1));
    }

    // 否则，将结果作为可观察对象返回
    return of(replyResult).pipe(take(1));
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 回复
   *
   * @param callback
   */
  reply(callback: WsMockApiReplyCallback): void {
    // 存储回复
    this._reply = callback;
  }

  /**
   * 回复数
   *
   * @param count
   */
  replyCount(count: number): void {
    // 存储回复数
    this._replyCount = count;
  }
}
