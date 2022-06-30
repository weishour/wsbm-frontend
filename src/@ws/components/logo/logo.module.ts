import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsLogoComponent } from '@ws/components/logo/logo.component';

@NgModule({
  declarations: [WsLogoComponent],
  imports: [CommonModule],
  exports: [WsLogoComponent],
})
export class WsLogoModule {}
