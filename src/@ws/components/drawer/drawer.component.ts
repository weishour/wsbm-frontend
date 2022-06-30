import {
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
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { WsDrawerMode, WsDrawerPosition } from '@ws/components/drawer/drawer.types';
import { WsDrawerService } from '@ws/components/drawer/drawer.service';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ws-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'wsDrawer',
})
export class WsDrawerComponent implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_fixed: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  // 位置是固定的还是绝对的
  @Input() fixed: boolean = false;
  // 模式 (over模式可用于将抽屉放在内容的顶部，side模式可用于推动内容并将抽屉放在其旁边)
  @Input() mode: WsDrawerMode = 'side';
  // 唯一名称
  @Input() name: string = this._wsUtilsService.randomId();
  // 是否打开
  @Input() opened: boolean = false;
  // 位置
  @Input() position: WsDrawerPosition = 'left';
  // 遮罩层是否透明
  @Input() transparentOverlay: boolean = false;
  // fixed更改后发出的事件
  @Output() readonly fixedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  // mode更改后发出的事件
  @Output() readonly modeChanged: EventEmitter<WsDrawerMode> = new EventEmitter<WsDrawerMode>();
  // opened更改后发出的事件
  @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  // position更改后发出的事件
  @Output() readonly positionChanged: EventEmitter<WsDrawerPosition> =
    new EventEmitter<WsDrawerPosition>();

  private _animationsEnabled: boolean = false;
  private readonly _handleOverlayClick: any;
  private _hovered: boolean = false;
  private _overlay: HTMLElement;
  private _player: AnimationPlayer;

  /**
   * 构造函数
   */
  constructor(
    private _animationBuilder: AnimationBuilder,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
    private _wsDrawerService: WsDrawerService,
    private _wsUtilsService: WsUtilsService,
  ) {
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
      'ws-drawer-animations-enabled': this._animationsEnabled,
      'ws-drawer-fixed': this.fixed,
      'ws-drawer-hover': this._hovered,
      [`ws-drawer-mode-${this.mode}`]: true,
      'ws-drawer-opened': this.opened,
      [`ws-drawer-position-${this.position}`]: true,
    };
  }

  /**
   * Host binding for component inline styles
   */
  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.opened ? 'visible' : 'hidden',
    };
  }

  // ----------------------------------------------------------------------------
  // @ 装饰方法
  // ----------------------------------------------------------------------------

  /**
   * On mouseenter
   *
   * @private
   */
  @HostListener('mouseenter')
  private _onMouseenter(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = true;
  }

  /**
   * On mouseleave
   *
   * @private
   */
  @HostListener('mouseleave')
  private _onMouseleave(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
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
    // Fixed
    if ('fixed' in changes) {
      // 将值强制为布尔值
      this.fixed = coerceBooleanProperty(changes.fixed.currentValue);

      // 执行可观察对象
      this.fixedChanged.next(this.fixed);
    }

    // 模式
    if ('mode' in changes) {
      // 获取以前的值和当前值
      const previousMode = changes.mode.previousValue;
      const currentMode = changes.mode.currentValue;

      // 禁用动画
      this._disableAnimations();

      // 如果模式改变:'over -> side'
      if (previousMode === 'over' && currentMode === 'side') {
        // 隐藏遮罩
        this._hideOverlay();
      }

      // 如果模式改变:'side -> over'
      if (previousMode === 'side' && currentMode === 'over') {
        // 如果抽屉已打开
        if (this.opened) {
          // 显示遮罩
          this._showOverlay();
        }
      }

      // 执行可观察对象
      this.modeChanged.next(currentMode);

      // 启用延迟后的动画
      // 延迟必须大于当前的转换持续时间，以确保在模式改变时没有动画
      setTimeout(() => {
        this._enableAnimations();
      }, 500);
    }

    // Opened
    if ('opened' in changes) {
      // 将值强制为布尔值
      const open = coerceBooleanProperty(changes.opened.currentValue);

      // 打开/关闭抽屉
      this._toggleOpened(open);
    }

    // 位置
    if ('position' in changes) {
      // 执行可观察对象
      this.positionChanged.next(this.position);
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
    // 注册组件
    this._wsDrawerService.registerComponent(this.name, this);
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 完成动画
    if (this._player) {
      this._player.finish();
    }

    // 从注册表中注销该抽屉
    this._wsDrawerService.deregisterComponent(this.name);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 打开抽屉
   */
  open(): void {
    // 如果抽屉已经打开，则返回
    if (this.opened) {
      return;
    }

    // 打开抽屉
    this._toggleOpened(true);
  }

  /**
   * 关闭抽屉
   */
  close(): void {
    // 如果抽屉已经关闭，则返回
    if (!this.opened) {
      return;
    }

    // 关闭抽屉
    this._toggleOpened(false);
  }

  /**
   * 切换抽屉
   */
  toggle(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
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
    // 如果动画已经禁用，则返回
    if (!this._animationsEnabled) {
      return;
    }

    // 禁用动画
    this._animationsEnabled = false;
  }

  /**
   * 显示背景
   *
   * @private
   */
  private _showOverlay(): void {
    // 创建背景元素
    this._overlay = this._renderer2.createElement('div');

    // 给背景元素添加一个class
    this._overlay.classList.add('ws-drawer-overlay');

    // 根据固定选项添加一个class
    if (this.fixed) {
      this._overlay.classList.add('ws-drawer-overlay-fixed');
    }

    // 根据transparentOverlay选项添加一个class
    if (this.transparentOverlay) {
      this._overlay.classList.add('ws-drawer-overlay-transparent');
    }

    // 将背景添加到抽屉的父部分
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    // 创建进入动画，并将其附加到动画播放器
    this._player = this._animationBuilder
      .build([
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 })),
      ])
      .create(this._overlay);

    // 播放动画
    this._player.play();

    // 添加一个事件监听器到遮罩
    this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * 隐藏背景
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
      // 如果背景还存在的话...
      if (this._overlay) {
        // 删除事件监听器
        this._overlay.removeEventListener('click', this._handleOverlayClick);

        // 移除背景
        this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }
    });
  }

  /**
   * 打开/关闭抽屉
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
    // Set the opened
    this.opened = open;

    // 启用动画
    this._enableAnimations();

    // 如果模式是'over'
    if (this.mode === 'over') {
      // 如果抽屉打开，则显示覆盖层
      if (open) {
        this._showOverlay();
      }
      // 否则，关闭覆盖
      else {
        this._hideOverlay();
      }
    }

    // 执行可观察对象
    this.openedChanged.next(open);
  }
}
