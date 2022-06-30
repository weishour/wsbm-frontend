import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsNotificationComponent } from '@ws/components/notification/notification.component';

@NgModule({
  declarations: [WsNotificationComponent],
  imports: [CommonModule],
  exports: [WsNotificationComponent],
})
export class WsNotificationModule {}
