import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { WsConfigService } from '@ws/services/config';
import { map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { fromPairs } from 'lodash-es';

@Injectable()
export class WsMediaWatcherService {
  private _onMediaChange: ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }> =
    new ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }>(1);

  /**
   * 构造函数
   */
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _wsConfigService: WsConfigService,
  ) {
    this._wsConfigService.config$
      .pipe(
        map(config =>
          fromPairs(
            Object.entries(config.screens).map(([alias, screen]) => [
              alias,
              `(min-width: ${screen})`,
            ]),
          ),
        ),
        switchMap(screens =>
          this._breakpointObserver.observe(Object.values(screens)).pipe(
            map(state => {
              // 准备好可观察对象的值并设置它们的默认值
              const matchingAliases: string[] = [];
              const matchingQueries: any = {};

              // 获取匹配的断点并使用它们填充主题
              const matchingBreakpoints =
                Object.entries(state.breakpoints).filter(([query, matches]) => matches) ?? [];
              for (const [query] of matchingBreakpoints) {
                // 找到匹配查询的别名
                const matchingAlias = Object.entries(screens).find(([alias, q]) => q === query)[0];

                // 将匹配的查询添加到可观察值中
                if (matchingAlias) {
                  matchingAliases.push(matchingAlias);
                  matchingQueries[matchingAlias] = query;
                }
              }

              // 执行可观察对象
              this._onMediaChange.next({
                matchingAliases,
                matchingQueries,
              });
            }),
          ),
        ),
      )
      .subscribe();
  }

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * _onMediaChange访问器
   */
  get onMediaChange$(): Observable<{ matchingAliases: string[]; matchingQueries: any }> {
    return this._onMediaChange.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 媒体查询更改
   *
   * @param query
   */
  onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this._breakpointObserver.observe(query);
  }
}
