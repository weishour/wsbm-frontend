import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { WsVerticalNavigationComponent } from '@ws/components/navigation/vertical/vertical.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ws-vertical-navigation-aside-item',
  templateUrl: './aside.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsVerticalNavigationAsideItemComponent implements OnChanges, OnInit {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  static ngAcceptInputType_skipChildren: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() activeItemId: string;
  @Input() autoCollapse: boolean;
  @Input() item: WsNavigationItem;
  @Input() name: string;
  @Input() skipChildren: boolean;

  active: boolean = false;
  trackByFn = this._wsUtilsService.trackByFn;

  private _wsVerticalNavigationComponent: WsVerticalNavigationComponent;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _wsNavigationService: WsNavigationService,
    private _wsUtilsService: WsUtilsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 活动项id
    if ('activeItemId' in changes) {
      // 如果活动则标记
      this._markIfActive(this._router.url);
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 如果活动则标记
    this._markIfActive(this._router.url);

    // 将监听器附加到NavigationEnd事件
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe((event: NavigationEnd) => {
        // 如果活动则标记
        this._markIfActive(event.urlAfterRedirects);
      });

    // 获取父导航组件
    this._wsVerticalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 在导航组件上订阅onRefreshed
    this._wsVerticalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 检查给定的条目是否在它的一个子条目中有给定的url
   *
   * @param item
   * @param currentUrl
   * @private
   */
  private _hasActiveChild(item: WsNavigationItem, currentUrl: string): boolean {
    const children = item.children;

    if (!children) {
      return false;
    }

    for (const child of children) {
      if (child.children) {
        if (this._hasActiveChild(child, currentUrl)) {
          return true;
        }
      }

      // 跳过“basic”以外的项目
      if (child.type !== 'basic') {
        continue;
      }

      // 检查子程序是否有链接并且是活动的
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 决定并标记项目是否活动
   *
   * @private
   */
  private _markIfActive(currentUrl: string): void {
    // 检查activeItemId是否等于这个项目id
    this.active = this.activeItemId === this.item.id;

    // 如果aside有一个活跃的子元素，总是将其标记为活跃
    if (this._hasActiveChild(this.item, currentUrl)) {
      this.active = true;
    }

    // 检测变更
    this._changeDetectorRef.markForCheck();
  }
}
