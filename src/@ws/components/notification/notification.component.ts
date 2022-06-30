import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { HotToastRef } from '@ngneat/hot-toast';
import { NotificationDataType } from '@ws/interfaces';

@Component({
  selector: 'ws-notification',
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsNotificationComponent implements OnInit {
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;

  constructor(
    @Optional() @Inject(HotToastRef) public toastRef: HotToastRef<NotificationDataType>,
  ) {}

  ngOnInit(): void {
    const data = this.toastRef.data;

    this.title = data.title;
    this.content = data.content;
  }
}
