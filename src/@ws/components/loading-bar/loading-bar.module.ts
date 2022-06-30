import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WsLoadingBarComponent } from '@ws/components/loading-bar/loading-bar.component';

@NgModule({
  declarations: [WsLoadingBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [WsLoadingBarComponent],
})
export class WsLoadingBarModule {}
