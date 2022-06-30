import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { WsFullscreenComponent } from '@ws/components/fullscreen/fullscreen.component';

@NgModule({
  declarations: [WsFullscreenComponent],
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommonModule, TranslocoModule],
  exports: [WsFullscreenComponent],
})
export class WsFullscreenModule {}
