import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsDrawerComponent } from '@ws/components/drawer/drawer.component';

@NgModule({
  declarations: [WsDrawerComponent],
  imports: [CommonModule],
  exports: [WsDrawerComponent],
})
export class WsDrawerModule {}
