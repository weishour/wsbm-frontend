import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsCardComponent } from '@ws/components/card/card.component';

@NgModule({
  declarations: [WsCardComponent],
  imports: [CommonModule],
  exports: [WsCardComponent],
})
export class WsCardModule {}
