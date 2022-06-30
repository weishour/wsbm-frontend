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
import { Message } from 'app/layout/common/messages/messages.types';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'messages',
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messagesOrigin') private _messagesOrigin: MatButton;
  @ViewChild('messagesPanel') private _messagesPanel: TemplateRef<any>;

  messages: Message[];
  unreadCount: number = 0;
  trackByFn = this._wsUtilsService.trackByFn;

  private _overlayRef: OverlayRef;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _messagesService: MessagesService,
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
    // 订阅消息更改
    this._messagesService.messages$
      .pipe(untilDestroyed(this))
      .subscribe((messages: Message[]) => {
        // 加载消息
        this.messages = messages;

        // 计算未读计数
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
   * 打开消息面板
   */
  openPanel(): void {
    // 如果消息面板或其源未定义，则返回
    if (!this._messagesPanel || !this._messagesOrigin) {
      return;
    }

    // 创建遮罩，如果它不存在
    if (!this._overlayRef) {
      this._createOverlay();
    }

    // 将门户附加到遮罩层上
    this._overlayRef.attach(new TemplatePortal(this._messagesPanel, this._viewContainerRef));
  }

  /**
   * 关闭消息面板
   */
  closePanel(): void {
    this._overlayRef.detach();
  }

  /**
   * 将所有消息标记为已读
   */
  markAllAsRead(): void {
    // 标记为已读
    this._messagesService.markAllAsRead().subscribe();
  }

  /**
   * 切换给定消息的读取状态
   */
  toggleRead(message: Message): void {
    // 切换读取状态
    message.read = !message.read;

    // 更新消息
    this._messagesService.update(message.id, message).subscribe();
  }

  /**
   * 删除给定的消息
   */
  delete(message: Message): void {
    // 删除消息
    this._messagesService.delete(message.id).subscribe();
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
        .flexibleConnectedTo(this._messagesOrigin._elementRef.nativeElement)
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

    // 在背景幕上点击分离门户的覆盖层
    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }

  /**
   * 计算未读的数量
   *
   * @private
   */
  private _calculateUnreadCount(): void {
    let count = 0;

    if (this.messages && this.messages.length) {
      count = this.messages.filter(message => !message.read).length;
    }

    this.unreadCount = count;
  }
}
