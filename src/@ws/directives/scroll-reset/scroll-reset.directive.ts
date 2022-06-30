import { Directive, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Directive({
  selector: '[wsScrollReset]',
  exportAs: 'wsScrollReset',
})
export class WsScrollResetDirective implements OnInit {
  /**
   * 构造函数
   */
  constructor(private _elementRef: ElementRef, private _router: Router) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅NavigationEnd事件
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        // 将元素的滚动位置重置为顶部
        this._elementRef.nativeElement.scrollTop = 0;
      });
  }
}
