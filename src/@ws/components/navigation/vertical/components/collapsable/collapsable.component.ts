import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { wsAnimations } from '@ws/animations';
import { WsVerticalNavigationComponent } from '@ws/components/navigation/vertical/vertical.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ws-vertical-navigation-collapsable-item',
  templateUrl: './collapsable.component.html',
  animations: wsAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsVerticalNavigationCollapsableItemComponent implements OnInit {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() autoCollapse: boolean;
  @Input() item: WsNavigationItem;
  @Input() name: string;

  isCollapsed: boolean = true;
  isExpanded: boolean = false;
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
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 组件类的HostBinding
   */
  @HostBinding('class') get classList(): any {
    return {
      'ws-vertical-navigation-item-collapsed': this.isCollapsed,
      'ws-vertical-navigation-item-expanded': this.isExpanded,
    };
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 获取父导航组件
    this._wsVerticalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 如果该条目的子条目具有与当前url匹配的url，展开…
    if (this._hasActiveChild(this.item, this._router.url)) {
      this.expand();
    }
    // 否则
    else {
      // 如果自动折叠打开，则折叠
      if (this.autoCollapse) {
        this.collapse();
      }
    }

    // 从服务中侦听onCollapsableItemCollapsed
    this._wsVerticalNavigationComponent.onCollapsableItemCollapsed
      .pipe(untilDestroyed(this))
      .subscribe(collapsedItem => {
        // 检查折叠项是否为空
        if (collapsedItem === null) {
          return;
        }

        // 如果它是被折叠项的子项，则进行折叠
        if (this._isChildrenOf(collapsedItem, this.item)) {
          this.collapse();
        }
      });

    // 如果autoCollapse打开，则从服务中监听onCollapsableItemExpanded
    if (this.autoCollapse) {
      this._wsVerticalNavigationComponent.onCollapsableItemExpanded
        .pipe(untilDestroyed(this))
        .subscribe(expandedItem => {
          // 检查展开项是否为空
          if (expandedItem === null) {
            return;
          }

          // 检查这是否是展开项的父项
          if (this._isChildrenOf(this.item, expandedItem)) {
            return;
          }

          // 检查它是否有与当前活动url匹配的子url
          if (this._hasActiveChild(this.item, this._router.url)) {
            return;
          }

          // 检查这是否是展开项
          if (this.item === expandedItem) {
            return;
          }

          // 如果以上条件都不匹配，折叠此项
          this.collapse();
        });
    }

    // 将监听器附加到NavigationEnd事件
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe((event: NavigationEnd) => {
        // 如果该条目的子条目具有与当前url匹配的url，展开…
        if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
          this.expand();
        }
        // 否则
        else {
          // 如果自动折叠打开，则折叠
          if (this.autoCollapse) {
            this.collapse();
          }
        }
      });

    // 在导航组件上订阅onRefreshed
    this._wsVerticalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 折叠
   */
  collapse(): void {
    // 如果该项目被禁用，则返回
    if (this.item.disabled) {
      return;
    }

    // 如果项目已经折叠，则返回
    if (this.isCollapsed) {
      return;
    }

    // 折叠
    this.isCollapsed = true;
    this.isExpanded = !this.isCollapsed;

    // 检测变更
    this._changeDetectorRef.markForCheck();

    // 执行可观察对象
    this._wsVerticalNavigationComponent.onCollapsableItemCollapsed.next(this.item);
  }

  /**
   * 展开
   */
  expand(): void {
    // 如果该项目被禁用，则返回
    if (this.item.disabled) {
      return;
    }

    // 如果项已经展开，则返回
    if (!this.isCollapsed) {
      return;
    }

    // 展开
    this.isCollapsed = false;
    this.isExpanded = !this.isCollapsed;

    // 检测变更
    this._changeDetectorRef.markForCheck();

    // 执行可观察对象
    this._wsVerticalNavigationComponent.onCollapsableItemExpanded.next(this.item);
  }

  /**
   * 切换折叠
   */
  toggleCollapsable(): void {
    // 切换折叠/展开
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
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

      // 检查子程序是否有链接并且是活动的
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查这是否是给定项的子项
   *
   * @param parent
   * @param item
   * @private
   */
  private _isChildrenOf(parent: WsNavigationItem, item: WsNavigationItem): boolean {
    const children = parent.children;

    if (!children) {
      return false;
    }

    if (children.indexOf(item) > -1) {
      return true;
    }

    for (const child of children) {
      if (child.children) {
        if (this._isChildrenOf(child, item)) {
          return true;
        }
      }
    }

    return false;
  }
}
