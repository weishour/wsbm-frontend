import { NgModule } from '@angular/core';
import { WsScrollResetDirective } from '@ws/directives/scroll-reset/scroll-reset.directive';

@NgModule({
  declarations: [WsScrollResetDirective],
  exports: [WsScrollResetDirective],
})
export class WsScrollResetModule {}
