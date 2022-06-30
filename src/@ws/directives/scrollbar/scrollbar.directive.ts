import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ScrollbarGeometry, ScrollbarPosition } from '@ws/directives/scrollbar/scrollbar.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, fromEvent } from 'rxjs';
import { merge } from 'lodash-es';
import PerfectScrollbar from 'perfect-scrollbar';

/**
 * Wrapper directive for the Perfect Scrollbar: https://github.com/mdbootstrap/perfect-scrollbar
 */
 @UntilDestroy()
@Directive({
  selector: '[wsScrollbar]',
  exportAs: 'wsScrollbar',
})
export class WsScrollbarDirective implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_wsScrollbar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  // 是否启用或禁用自定义滚动条
  @Input() wsScrollbar: boolean = true;
  // 完美的滚动条选项
  @Input() wsScrollbarOptions: PerfectScrollbar.Options;

  private _animation: number;
  private _options: PerfectScrollbar.Options;
  private _ps: PerfectScrollbar;

  /**
   * 构造函数
   */
  constructor(
    private _elementRef: ElementRef,
    private _platform: Platform,
    private _router: Router,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * _elementRef访问器
   */
  get elementRef(): ElementRef {
    return this._elementRef;
  }

  /**
   * _ps访问器
   */
  get ps(): PerfectScrollbar | null {
    return this._ps;
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 开启
    if ('wsScrollbar' in changes) {
      // 将空字符串解释为'true'
      this.wsScrollbar = coerceBooleanProperty(changes.wsScrollbar.currentValue);

      // 如果启用，初始化指令
      if (this.wsScrollbar) {
        this._init();
      }
      // 否则销毁
      else {
        this._destroy();
      }
    }

    // 滚动条选项
    if ('wsScrollbarOptions' in changes) {
      // 合并选项
      this._options = merge({}, this._options, changes.wsScrollbarOptions.currentValue);

      // 如果未初始化则返回
      if (!this._ps) {
        return;
      }

      // 销毁并重新初始化PerfectScrollbar来更新它的选项
      setTimeout(() => {
        this._destroy();
      });

      setTimeout(() => {
        this._init();
      });
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅窗口调整大小事件
    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this), debounceTime(150))
      .subscribe(() => {
        // 更新PerfectScrollbar
        this.update();
      });
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    this._destroy();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 是否启用
   */
  isEnabled(): boolean {
    return this.wsScrollbar;
  }

  /**
   * 更新滚动条
   */
  update(): void {
    // 如果未初始化则返回
    if (!this._ps) {
      return;
    }

    // 更新PerfectScrollbar
    this._ps.update();
  }

  /**
   * 销毁滚动条
   */
  destroy(): void {
    this.ngOnDestroy();
  }

  /**
   * 返回可滚动元素的几何位置
   *
   * @param prefix
   */
  geometry(prefix: string = 'scroll'): ScrollbarGeometry {
    return new ScrollbarGeometry(
      this._elementRef.nativeElement[prefix + 'Left'],
      this._elementRef.nativeElement[prefix + 'Top'],
      this._elementRef.nativeElement[prefix + 'Width'],
      this._elementRef.nativeElement[prefix + 'Height'],
    );
  }

  /**
   * 返回可滚动元素的位置
   *
   * @param absolute
   */
  position(absolute: boolean = false): ScrollbarPosition {
    let scrollbarPosition;

    if (!absolute && this._ps) {
      scrollbarPosition = new ScrollbarPosition(this._ps.reach.x || 0, this._ps.reach.y || 0);
    } else {
      scrollbarPosition = new ScrollbarPosition(
        this._elementRef.nativeElement.scrollLeft,
        this._elementRef.nativeElement.scrollTop,
      );
    }

    return scrollbarPosition;
  }

  /**
   * 滚动到
   *
   * @param x
   * @param y
   * @param speed
   */
  scrollTo(x: number, y?: number, speed?: number): void {
    if (y == null && speed == null) {
      this.animateScrolling('scrollTop', x, speed);
    } else {
      if (x != null) {
        this.animateScrolling('scrollLeft', x, speed);
      }

      if (y != null) {
        this.animateScrolling('scrollTop', y, speed);
      }
    }
  }

  /**
   * 水平滚动
   *
   * @param x
   * @param speed
   */
  scrollToX(x: number, speed?: number): void {
    this.animateScrolling('scrollLeft', x, speed);
  }

  /**
   * 垂直滚动
   *
   * @param y
   * @param speed
   */
  scrollToY(y: number, speed?: number): void {
    this.animateScrolling('scrollTop', y, speed);
  }

  /**
   * 向上滚动
   *
   * @param offset
   * @param speed
   */
  scrollToTop(offset: number = 0, speed?: number): void {
    this.animateScrolling('scrollTop', offset, speed);
  }

  /**
   * 向下滚动
   *
   * @param offset
   * @param speed
   */
  scrollToBottom(offset: number = 0, speed?: number): void {
    const top =
      this._elementRef.nativeElement.scrollHeight - this._elementRef.nativeElement.clientHeight;
    this.animateScrolling('scrollTop', top - offset, speed);
  }

  /**
   * 向左滚动
   *
   * @param offset
   * @param speed
   */
  scrollToLeft(offset: number = 0, speed?: number): void {
    this.animateScrolling('scrollLeft', offset, speed);
  }

  /**
   * 向右滚动
   *
   * @param offset
   * @param speed
   */
  scrollToRight(offset: number = 0, speed?: number): void {
    const left =
      this._elementRef.nativeElement.scrollWidth - this._elementRef.nativeElement.clientWidth;
    this.animateScrolling('scrollLeft', left - offset, speed);
  }

  /**
   * 滚动到元素
   *
   * @param qs
   * @param offset
   * @param ignoreVisible If true, scrollToElement won't happen if element is already inside the current viewport
   * @param speed
   */
  scrollToElement(
    qs: string,
    offset: number = 0,
    ignoreVisible: boolean = false,
    speed?: number,
  ): void {
    const element = this._elementRef.nativeElement.querySelector(qs);

    if (!element) {
      return;
    }

    const elementPos = element.getBoundingClientRect();
    const scrollerPos = this._elementRef.nativeElement.getBoundingClientRect();

    if (this._elementRef.nativeElement.classList.contains('ps--active-x')) {
      if (ignoreVisible && elementPos.right <= scrollerPos.right - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollLeft'];
      const position = elementPos.left - scrollerPos.left + currentPos;

      this.animateScrolling('scrollLeft', position + offset, speed);
    }

    if (this._elementRef.nativeElement.classList.contains('ps--active-y')) {
      if (ignoreVisible && elementPos.bottom <= scrollerPos.bottom - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollTop'];
      const position = elementPos.top - scrollerPos.top + currentPos;

      this.animateScrolling('scrollTop', position + offset, speed);
    }
  }

  /**
   * 动画滚动
   *
   * @param target
   * @param value
   * @param speed
   */
  animateScrolling(target: string, value: number, speed?: number): void {
    if (this._animation) {
      window.cancelAnimationFrame(this._animation);
      this._animation = null;
    }

    if (!speed || typeof window === 'undefined') {
      this._elementRef.nativeElement[target] = value;
    } else if (value !== this._elementRef.nativeElement[target]) {
      let newValue = 0;
      let scrollCount = 0;

      let oldTimestamp = performance.now();
      let oldValue = this._elementRef.nativeElement[target];

      const cosParameter = (oldValue - value) / 2;

      const step = (newTimestamp: number): void => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
        newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

        // 只有在滚动位置没有改变的情况下才继续动画
        if (this._elementRef.nativeElement[target] === oldValue) {
          if (scrollCount >= Math.PI) {
            this.animateScrolling(target, value, 0);
          } else {
            this._elementRef.nativeElement[target] = newValue;

            // 在缩小的页面上，产生的偏移量可能不同
            oldValue = this._elementRef.nativeElement[target];
            oldTimestamp = newTimestamp;

            this._animation = window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 初始化
   *
   * @private
   */
  private _init(): void {
    // 如果已经初始化则返回
    if (this._ps) {
      return;
    }

    // 如果在移动或不在浏览器上则返回
    if (this._platform.ANDROID || this._platform.IOS || !this._platform.isBrowser) {
      this.wsScrollbar = false;
      return;
    }

    // 初始化PerfectScrollbar
    this._ps = new PerfectScrollbar(this._elementRef.nativeElement, { ...this._options });
  }

  /**
   * 销毁
   *
   * @private
   */
  private _destroy(): void {
    // 如果未初始化则返回
    if (!this._ps) {
      return;
    }

    // 销毁PerfectScrollbar
    this._ps.destroy();

    // 清理
    this._ps = null;
  }
}
