import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsHighlightComponent } from '@ws/components/highlight/highlight.component';

@NgModule({
  declarations: [WsHighlightComponent],
  imports: [CommonModule],
  exports: [WsHighlightComponent],
})
export class WsHighlightModule {}
