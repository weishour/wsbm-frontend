import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable()
export class WsSplashScreenService {
  /**
   * 构造函数
   */
  constructor(@Inject(DOCUMENT) private _document: Document, private _router: Router) {
    // 在第一个NavigationEnd事件中隐藏它
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        this.hide();
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 显示启动画面
   */
  show(): void {
    this._document.body.classList.remove('ws-splash-screen-hidden');
  }

  /**
   * 隐藏启动画面
   */
  hide(): void {
    this._document.body.classList.add('ws-splash-screen-hidden');
  }
}
