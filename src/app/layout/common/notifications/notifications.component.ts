import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'notifications',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
  @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

  notifications: Notification[];
  unreadCount: number = 0;
  trackByFn = this._wsUtilsService.trackByFn;

  private _overlayRef: OverlayRef;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _notificationsService: NotificationsService,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _wsUtilsService: WsUtilsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅通知更改
    this._notificationsService.notifications$
      .pipe(untilDestroyed(this))
      .subscribe((notifications: Notification[]) => {
        // 加载通知
        this.notifications = notifications;

        // 计算未读数量
        this._calculateUnreadCount();

        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {
    // 销毁遮罩
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 打开通知面板
   */
  openPanel(): void {
    // 如果通知面板或其原点未定义，则返回
    if (!this._notificationsPanel || !this._notificationsOrigin) {
      return;
    }

    // 创建覆盖，如果它不存在
    if (!this._overlayRef) {
      this._createOverlay();
    }

    // 将门户附加到覆盖层上
    this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
  }

  /**
   * 关闭通知面板
   */
  closePanel(): void {
    this._overlayRef.detach();
  }

  /**
   * 将所有通知标记为已读
   */
  markAllAsRead(): void {
    // 标记为已读
    this._notificationsService.markAllAsRead().subscribe();
  }

  /**
   * 切换给定通知的读取状态
   */
  toggleRead(notification: Notification): void {
    // 切换读取状态
    notification.read = !notification.read;

    // 更新通知
    this._notificationsService.update(notification.id, notification).subscribe();
  }

  /**
   * 删除给定的通知
   */
  delete(notification: Notification): void {
    // 删除通知
    this._notificationsService.delete(notification.id).subscribe();
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 创建遮罩
   */
  private _createOverlay(): void {
    // 创建遮罩
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'ws-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]),
    });

    // Detach the overlay from the portal on backdrop click
    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }

  /**
   * 计算未读数量
   *
   * @private
   */
  private _calculateUnreadCount(): void {
    let count = 0;

    if (this.notifications && this.notifications.length) {
      count = this.notifications.filter(notification => !notification.read).length;
    }

    this.unreadCount = count;
  }
}
