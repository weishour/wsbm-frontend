import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { wsAnimations } from '@ws/animations';
import { WsAlertAppearance, WsAlertType } from '@ws/components/alert/alert.types';
import { WsAlertService } from '@ws/components/alert/alert.service';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ws-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: wsAnimations,
  exportAs: 'wsAlert',
})
export class WsAlertComponent implements OnChanges, OnInit {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_dismissible: BooleanInput;
  static ngAcceptInputType_dismissed: BooleanInput;
  static ngAcceptInputType_showIcon: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  // 外观
  @Input() appearance: WsAlertAppearance = 'soft';
  // 是否被关闭
  @Input() dismissed: boolean = false;
  // 是否可关闭
  @Input() dismissible: boolean = false;
  // 唯一名称
  @Input() name: string = this._wsUtilsService.randomId();
  // 是否显示图标
  @Input() showIcon: boolean = true;
  // 类型
  @Input() type: WsAlertType = 'primary';
  // 打开或者关闭后发出的事件
  @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _wsAlertService: WsAlertService,
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
      'ws-alert-appearance-border': this.appearance === 'border',
      'ws-alert-appearance-fill': this.appearance === 'fill',
      'ws-alert-appearance-outline': this.appearance === 'outline',
      'ws-alert-appearance-soft': this.appearance === 'soft',
      'ws-alert-dismissed': this.dismissed,
      'ws-alert-dismissible': this.dismissible,
      'ws-alert-show-icon': this.showIcon,
      'ws-alert-type-primary': this.type === 'primary',
      'ws-alert-type-accent': this.type === 'accent',
      'ws-alert-type-warn': this.type === 'warn',
      'ws-alert-type-basic': this.type === 'basic',
      'ws-alert-type-info': this.type === 'info',
      'ws-alert-type-success': this.type === 'success',
      'ws-alert-type-warning': this.type === 'warning',
      'ws-alert-type-error': this.type === 'error',
    };
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
    // Dismissed
    if ('dismissed' in changes) {
      // 将值强制为布尔值
      this.dismissed = coerceBooleanProperty(changes.dismissed.currentValue);

      // 撤离/显示警告提示
      this._toggleDismiss(this.dismissed);
    }

    // 可撤离
    if ('dismissible' in changes) {
      // 将值强制为布尔值
      this.dismissible = coerceBooleanProperty(changes.dismissible.currentValue);
    }

    // 显示图标
    if ('showIcon' in changes) {
      // 将值强制为布尔值
      this.showIcon = coerceBooleanProperty(changes.showIcon.currentValue);
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅撤离回调
    this._wsAlertService.onDismiss
      .pipe(
        filter(name => this.name === name),
        untilDestroyed(this),
      )
      .subscribe(() => {
        // 撤离警告提示
        this.dismiss();
      });

    // 订阅显示回调
    this._wsAlertService.onShow
      .pipe(
        filter(name => this.name === name),
        untilDestroyed(this),
      )
      .subscribe(() => {
        // 显示警告提示
        this.show();
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 撤离警告提示
   */
  dismiss(): void {
    // 如果警告提示已经撤离则返回
    if (this.dismissed) {
      return;
    }

    // 撤离警告提示
    this._toggleDismiss(true);
  }

  /**
   * 显示已撤离的警告提示
   */
  show(): void {
    // 如果警告提示已经显示则返回
    if (!this.dismissed) {
      return;
    }

    // 显示警告提示
    this._toggleDismiss(false);
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 撤销/显示警告提示
   *
   * @param dismissed
   * @private
   */
  private _toggleDismiss(dismissed: boolean): void {
    // 如果警告提示不可撤销则返回
    if (!this.dismissible) {
      return;
    }

    // Set the dismissed
    this.dismissed = dismissed;

    // 执行可观察对象
    this.dismissedChanged.next(this.dismissed);

    // Notify the change detector
    this._changeDetectorRef.markForCheck();
  }
}
