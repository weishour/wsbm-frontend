import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WsAlertComponent } from '@ws/components/alert/alert.component';

@NgModule({
  declarations: [WsAlertComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [WsAlertComponent],
})
export class WsAlertModule {}
