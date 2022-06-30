import { NgModule } from '@angular/core';
import { WsScrollbarDirective } from '@ws/directives/scrollbar/scrollbar.directive';

@NgModule({
  declarations: [WsScrollbarDirective],
  exports: [WsScrollbarDirective],
})
export class WsScrollbarModule {}
