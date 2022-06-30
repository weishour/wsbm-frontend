import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsPlayerComponent } from '@ws/components/player/player.component';

@NgModule({
  declarations: [WsPlayerComponent],
  imports: [CommonModule],
  exports: [WsPlayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WsPlayerModule {}
