import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { wsAnimations } from '@ws/animations';
import {
  WsNavigationItem,
  WsVerticalNavigationAppearance,
  WsVerticalNavigationMode,
  WsVerticalNavigationPosition,
} from '@ws/components/navigation/navigation.types';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsScrollbarDirective } from '@ws/directives/scrollbar/scrollbar.directive';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter, merge, ReplaySubject, Subscription } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ws-vertical-navigation',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
  animations: wsAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'wsVerticalNavigation',
})
export class WsVerticalNavigationComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_inner: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  // 导航及其抽屉的外观
  @Input() appearance: WsVerticalNavigationAppearance = 'default';
  // 自动折叠 (展开可展开导航项是否应关闭除活动菜单项的父项之外的其他展开项)
  @Input() autoCollapse: boolean = true;
  // 内部模式是否处于活动状态 (此模式允许在没有抽屉的情况下使用导航)
  @Input() inner: boolean = false;
  // 模式 (over模式可用于将抽屉放在内容的顶部，side模式可用于推动内容并将抽屉放在其旁边)
  @Input() mode: WsVerticalNavigationMode = 'side';
  // 唯一名称
  @Input() name: string = this._wsUtilsService.randomId();
  // 导航项数组
  @Input() navigation: WsNavigationItem[];
  // 导航抽屉是否打开
  @Input() opened: boolean = true;
  // 抽屉的位置
  @Input() position: WsVerticalNavigationPosition = 'left';
  // 抽屉的遮罩层是否透明
  @Input() transparentOverlay: boolean = false;
  // 导航外观更改后发出的事件
  @Output() readonly appearanceChanged: EventEmitter<WsVerticalNavigationAppearance> =
    new EventEmitter<WsVerticalNavigationAppearance>();
  // 导航模式更改后发出的事件
  @Output() readonly modeChanged: EventEmitter<WsVerticalNavigationMode> =
    new EventEmitter<WsVerticalNavigationMode>();
  // 导航的打开状态更改后发出的事件
  @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  // 导航位置更改后发出的事件
  @Output() readonly positionChanged: EventEmitter<WsVerticalNavigationPosition> =
    new EventEmitter<WsVerticalNavigationPosition>();
  // 基本导航菜单拖动后发出的事件
  @Output() readonly basicItemDropChanged: EventEmitter<CdkDragDrop<WsNavigationItem[]>> =
  new EventEmitter<CdkDragDrop<WsNavigationItem[]>>();
  @ViewChild('navigationContent') private _navigationContentEl: ElementRef;

  activeAsideItemId: string | null = null;
  onCollapsableItemCollapsed: ReplaySubject<WsNavigationItem> =
    new ReplaySubject<WsNavigationItem>(1);
  onCollapsableItemExpanded: ReplaySubject<WsNavigationItem> =
    new ReplaySubject<WsNavigationItem>(1);
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  trackByFn = this._wsUtilsService.trackByFn;

  private _animationsEnabled: boolean = false;
  private _asideOverlay: HTMLElement;
  private readonly _handleAsideOverlayClick: any;
  private readonly _handleOverlayClick: any;
  private _hovered: boolean = false;
  private _overlay: HTMLElement;
  private _player: AnimationPlayer;
  private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
  private _wsScrollbarDirectives!: QueryList<WsScrollbarDirective>;
  private _wsScrollbarDirectivesSubscription: Subscription;

  /**
   * 构造函数
   */
  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _scrollStrategyOptions: ScrollStrategyOptions,
    private _wsNavigationService: WsNavigationService,
    private _wsUtilsService: WsUtilsService,
  ) {
    this._handleAsideOverlayClick = (): void => {
      this.closeAside();
    };
    this._handleOverlayClick = (): void => {
      this.close();
    };
  }

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 组件类的HostBinding
   */
  @HostBinding('class') get classList(): any {
    return {
      'ws-vertical-navigation-animations-enabled': this._animationsEnabled,
      [`ws-vertical-navigation-appearance-${this.appearance}`]: true,
      'ws-vertical-navigation-hover': this._hovered,
      'ws-vertical-navigation-inner': this.inner,
      'ws-vertical-navigation-mode-over': this.mode === 'over',
      'ws-vertical-navigation-mode-side': this.mode === 'side',
      'ws-vertical-navigation-opened': this.opened,
      'ws-vertical-navigation-position-left': this.position === 'left',
      'ws-vertical-navigation-position-right': this.position === 'right',
    };
  }

  /**
   * 组件内联样式的宿主绑定
   */
  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.opened ? 'visible' : 'hidden',
    };
  }

  /**
   * Setter for wsScrollbarDirectives
   */
  @ViewChildren(WsScrollbarDirective)
  set wsScrollbarDirectives(wsScrollbarDirectives: QueryList<WsScrollbarDirective>) {
    // 存储指令
    this._wsScrollbarDirectives = wsScrollbarDirectives;

    // 如果没有指令则返回
    if (wsScrollbarDirectives.length === 0) {
      return;
    }

    // 取消订阅以前的订阅
    if (this._wsScrollbarDirectivesSubscription) {
      this._wsScrollbarDirectivesSubscription.unsubscribe();
    }

    // 更新可折叠项的滚动条
    this._wsScrollbarDirectivesSubscription = merge(
      this.onCollapsableItemCollapsed,
      this.onCollapsableItemExpanded,
    )
      .pipe(untilDestroyed(this), delay(250))
      .subscribe(() => {
        // 循环滚动条并更新它们
        wsScrollbarDirectives.forEach(wsScrollbarDirective => {
          wsScrollbarDirective.update();
        });
      });
  }

  // ----------------------------------------------------------------------------
  // @ 装饰方法
  // ----------------------------------------------------------------------------

  /**
   * 鼠标进入事件
   *
   * @private
   */
  @HostListener('mouseenter')
  private _onMouseenter(): void {
    // 启用动画
    this._enableAnimations();

    // 设置hovered
    this._hovered = true;
  }

  /**
   * 鼠标离开事件
   *
   * @private
   */
  @HostListener('mouseleave')
  private _onMouseleave(): void {
    // 启用动画
    this._enableAnimations();

    // 设置hovered
    this._hovered = false;
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
    // Appearance
    if ('appearance' in changes) {
      // 执行可观察对象
      this.appearanceChanged.next(changes.appearance.currentValue);
    }

    // Inner
    if ('inner' in changes) {
      // 将值强制为布尔值
      this.inner = coerceBooleanProperty(changes.inner.currentValue);
    }

    // 模式
    if ('mode' in changes) {
      // 获取以前的值和当前值
      const currentMode = changes.mode.currentValue;
      const previousMode = changes.mode.previousValue;

      // 禁用动画
      this._disableAnimations();

      // 如果模式改变:'over -> side'
      if (previousMode === 'over' && currentMode === 'side') {
        // 隐藏遮罩
        this._hideOverlay();
      }

      // 如果模式改变:'side -> over'
      if (previousMode === 'side' && currentMode === 'over') {
        // 关闭侧边
        this.closeAside();

        // 如果导航打开
        if (this.opened) {
          // 显示遮罩
          this._showOverlay();
        }
      }

      // 执行可观察对象
      this.modeChanged.next(currentMode);

      // 延迟必须大于当前的转换持续时间，以确保在模式改变时没有动画
      setTimeout(() => {
        this._enableAnimations();
      }, 500);
    }

    // 导航
    if ('navigation' in changes) {
      // 检测变更
      this._changeDetectorRef.markForCheck();
    }

    // 打开
    if ('opened' in changes) {
      // 将值强制为布尔值
      this.opened = coerceBooleanProperty(changes.opened.currentValue);

      // 打开/关闭导航
      this._toggleOpened(this.opened);
    }

    // 位置
    if ('position' in changes) {
      // 执行可观察对象
      this.positionChanged.next(changes.position.currentValue);
    }

    // 透明遮罩
    if ('transparentOverlay' in changes) {
      // 将值强制为布尔值
      this.transparentOverlay = coerceBooleanProperty(changes.transparentOverlay.currentValue);
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 确保名称输入不是空字符串
    if (this.name === '') {
      this.name = this._wsUtilsService.randomId();
    }

    // 注册导航组件
    this._wsNavigationService.registerComponent(this.name, this);

    // 订阅'NavigationEnd'事件
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        // 如果模式是'over'，导航打开…
        if (this.mode === 'over' && this.opened) {
          // 关闭导航
          this.close();
        }

        // 如果模式是'side'和侧边是激活的…
        if (this.mode === 'side' && this.activeAsideItemId) {
          // 关闭侧边
          this.closeAside();
        }
      });
  }

  /**
   * 视图初始化后
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      // 如果'navigation content'元素不存在则返回
      if (!this._navigationContentEl) {
        return;
      }

      // 如果“导航内容”元素没有完美的滚动条激活…
      if (!this._navigationContentEl.nativeElement.classList.contains('ps')) {
        // 找到活动项目
        const activeItem = this._navigationContentEl.nativeElement.querySelector(
          '.ws-vertical-navigation-item-active',
        );

        // 如果活动项存在，则将其滚动到视图中
        if (activeItem) {
          activeItem.scrollIntoView();
        }
      }
      // 否则
      else {
        // 浏览所有的滚动条指令
        this._wsScrollbarDirectives.forEach(wsScrollbarDirective => {
          // 如果未启用则跳过
          if (!wsScrollbarDirective.isEnabled()) {
            return;
          }

          // 滚动到活动元素
          wsScrollbarDirective.scrollToElement(
            '.ws-vertical-navigation-item-active',
            -120,
            true,
          );
        });
      }
    });
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 如果导航和侧边被打开，则强制关闭它们
    this.close();
    this.closeAside();

    // 从注册表中注销导航组件
    this._wsNavigationService.deregisterComponent(this.name);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 刷新组件以应用更改
   */
  refresh(): void {
    // 检测变更
    this._changeDetectorRef.markForCheck();

    // 执行可观察对象
    this.onRefreshed.next(true);
  }

  /**
   * 打开导航
   */
  open(): void {
    // 如果导航已经打开，则返回
    if (this.opened) {
      return;
    }

    // 设置打开
    this._toggleOpened(true);
  }

  /**
   * 关闭导航
   */
  close(): void {
    // 如果导航已经关闭，则返回
    if (!this.opened) {
      return;
    }

    // 关闭侧边
    this.closeAside();

    // 设置关闭
    this._toggleOpened(false);
  }

  /**
   * 切换导航
   */
  toggle(): void {
    // 切换
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 打开侧边
   *
   * @param item
   */
  openAside(item: WsNavigationItem): void {
    // 如果该项目被禁用，则返回
    if (item.disabled || !item.id) {
      return;
    }

    // 打开
    this.activeAsideItemId = item.id;

    // 隐藏侧边的遮罩
    this._showAsideOverlay();

    // 检测变更
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 关闭侧边
   */
  closeAside(): void {
    // 关闭
    this.activeAsideItemId = null;

    // 隐藏侧边的遮罩
    this._hideAsideOverlay();

    // 检测变更
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 切换侧边
   *
   * @param item
   */
  toggleAside(item: WsNavigationItem): void {
    // Toggle
    if (this.activeAsideItemId === item.id) {
      this.closeAside();
    } else {
      this.openAside(item);
    }
  }

  /**
   * 基本导航菜单拖动事件
   * @param event
   */
  basicItemDrop(event: CdkDragDrop<WsNavigationItem[]>) {
    if (event.previousIndex !== event.currentIndex) {
      // 导航组件拖动变动
      moveItemInArray(this.navigation, event.previousIndex, event.currentIndex);
      // 执行可观察对象
      this.basicItemDropChanged.next(event);
    }
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 启用动画
   *
   * @private
   */
  private _enableAnimations(): void {
    // 如果动画已经启用，则返回
    if (this._animationsEnabled) {
      return;
    }

    // 启用动画
    this._animationsEnabled = true;
  }

  /**
   * 禁用动画
   *
   * @private
   */
  private _disableAnimations(): void {
    // 如果动画已经被禁用，则返回
    if (!this._animationsEnabled) {
      return;
    }

    // 禁用动画
    this._animationsEnabled = false;
  }

  /**
   * 显示遮罩
   *
   * @private
   */
  private _showOverlay(): void {
    // 如果已经有遮罩则返回
    if (this._asideOverlay) {
      return;
    }

    // 创建遮罩元素
    this._overlay = this._renderer2.createElement('div');

    // 给遮罩元素添加一个class
    this._overlay.classList.add('ws-vertical-navigation-overlay');

    // 根据transparentOverlay选项添加一个class
    if (this.transparentOverlay) {
      this._overlay.classList.add('ws-vertical-navigation-overlay-transparent');
    }

    // 将遮罩添加到导航的父节点
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    // 启用块滚动策略
    this._scrollStrategy.enable();

    // 创建进入动画，并将其附加到动画播放器
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
      .create(this._overlay);

    // 播放动画
    this._player.play();

    // 添加一个事件监听器到遮罩
    this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * 隐藏遮罩
   *
   * @private
   */
  private _hideOverlay(): void {
    if (!this._overlay) {
      return;
    }

    // 创建离开动画，并将其附加到动画播放器
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
      .create(this._overlay);

    // 播放动画
    this._player.play();

    // 一旦动画完成...
    this._player.onDone(() => {
      // 如果遮罩仍然存在…
      if (this._overlay) {
        // 删除事件监听器
        this._overlay.removeEventListener('click', this._handleOverlayClick);

        // 删除遮罩
        this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }

      // 禁用块滚动策略
      this._scrollStrategy.disable();
    });
  }

  /**
   * 显示侧边遮罩
   *
   * @private
   */
  private _showAsideOverlay(): void {
    // 如果已经有遮罩，则返回
    if (this._asideOverlay) {
      return;
    }

    // 创建遮罩元素
    this._asideOverlay = this._renderer2.createElement('div');

    // 给遮罩元素添加一个class
    this._asideOverlay.classList.add('ws-vertical-navigation-aside-overlay');

    // 将遮罩添加到导航的父部分
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._asideOverlay);

    // 创建进入动画，并将其附加到动画播放器
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
      .create(this._asideOverlay);

    // 播放动画
    this._player.play();

    // 添加一个事件监听器到遮罩
    this._asideOverlay.addEventListener('click', this._handleAsideOverlayClick);
  }

  /**
   * 隐藏侧边遮罩
   *
   * @private
   */
  private _hideAsideOverlay(): void {
    if (!this._asideOverlay) {
      return;
    }

    // 创建离开动画并将其附加到动画播放器
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
      .create(this._asideOverlay);

    // 播放动画
    this._player.play();

    // 一旦动画完成……
    this._player.onDone(() => {
      // 如果侧边遮罩仍然存在…
      if (this._asideOverlay) {
        // 删除事件监听器
        this._asideOverlay.removeEventListener('click', this._handleAsideOverlayClick);

        // 删除侧边遮罩
        this._asideOverlay.parentNode.removeChild(this._asideOverlay);
        this._asideOverlay = null;
      }
    });
  }

  /**
   * 打开/关闭导航
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
    // 设置打开
    this.opened = open;

    // 启用动画
    this._enableAnimations();

    // 如果导航打开，模式是“over”，显示遮罩
    if (this.mode === 'over') {
      if (this.opened) {
        this._showOverlay();
      } else {
        this._hideOverlay();
      }
    }

    // 执行可观察对象
    this.openedChanged.next(open);
  }
}
