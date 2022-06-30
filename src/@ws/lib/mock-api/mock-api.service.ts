import { Injectable } from '@angular/core';
import { compact, fromPairs } from 'lodash-es';
import { WsMockApiHandler } from '@ws/lib/mock-api/mock-api.request-handler';
import { WsMockApiMethods } from '@ws/lib/mock-api/mock-api.types';

@Injectable({
  providedIn: 'root',
})
export class WsMockApiService {
  private _handlers: { [key: string]: Map<string, WsMockApiHandler> } = {
    get: new Map<string, WsMockApiHandler>(),
    post: new Map<string, WsMockApiHandler>(),
    patch: new Map<string, WsMockApiHandler>(),
    delete: new Map<string, WsMockApiHandler>(),
    put: new Map<string, WsMockApiHandler>(),
    head: new Map<string, WsMockApiHandler>(),
    jsonp: new Map<string, WsMockApiHandler>(),
    options: new Map<string, WsMockApiHandler>(),
  };

  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 使用给定的方法和url从服务中查找处理程序
   *
   * @param method
   * @param url
   */
  findHandler(
    method: string,
    url: string,
  ): { handler: WsMockApiHandler | undefined; urlParams: { [key: string]: string } } {
    // 准备返回对象
    const matchingHandler: {
      handler: WsMockApiHandler | undefined;
      urlParams: { [key: string]: string };
    } = {
      handler: undefined,
      urlParams: {},
    };

    // 分割url
    const urlParts = url.split('/');

    // 获取所有相关的请求处理程序
    const handlers = this._handlers[method.toLowerCase()];

    // 遍历处理程序
    handlers.forEach((handler, handlerUrl) => {
      // 如果已经有匹配的处理程序，则跳过
      if (matchingHandler.handler) {
        return;
      }

      // 分割处理程序url
      const handlerUrlParts = handlerUrl.split('/');

      // 如果比较的url的长度不相同，则跳过
      if (urlParts.length !== handlerUrlParts.length) {
        return;
      }

      // 比较
      const matches = handlerUrlParts.every(
        (handlerUrlPart, index) =>
          handlerUrlPart === urlParts[index] || handlerUrlPart.startsWith(':'),
      );

      // 如果有匹配…
      if (matches) {
        // 分配匹配的处理程序
        matchingHandler.handler = handler;

        // 提取并分配参数
        matchingHandler.urlParams = fromPairs(
          compact(
            handlerUrlParts.map((handlerUrlPart, index) =>
              handlerUrlPart.startsWith(':')
                ? [handlerUrlPart.substring(1), urlParts[index]]
                : undefined,
            ),
          ),
        );
      }
    });

    return matchingHandler;
  }

  /**
   * 注册GET请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onGet(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('get', url, delay);
  }

  /**
   * 注册POST请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onPost(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('post', url, delay);
  }

  /**
   * 注册PATCH请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onPatch(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('patch', url, delay);
  }

  /**
   * 注册DELETE请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onDelete(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('delete', url, delay);
  }

  /**
   * 注册PUT请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onPut(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('put', url, delay);
  }

  /**
   * 注册HEAD请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onHead(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('head', url, delay);
  }

  /**
   * 注册JSONP请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onJsonp(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('jsonp', url, delay);
  }

  /**
   * 注册OPTIONS请求处理程序
   *
   * @param url - URL address of the mocked API endpoint
   * @param delay - Delay of the response in milliseconds
   */
  onOptions(url: string, delay?: number): WsMockApiHandler {
    return this._registerHandler('options', url, delay);
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 注册并返回处理程序的一个新实例
   *
   * @param method
   * @param url
   * @param delay
   * @private
   */
  private _registerHandler(
    method: WsMockApiMethods,
    url: string,
    delay?: number,
  ): WsMockApiHandler {
    // 创建WsMockApiRequestHandler的新实例
    const wsMockHttp = new WsMockApiHandler(url, delay);

    // 存储处理程序以从拦截器访问它
    this._handlers[method].set(url, wsMockHttp);

    // 返回实例
    return wsMockHttp;
  }
}
