import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { WsConfirmationService } from '@ws/services/confirmation/confirmation.service';
import { WsConfirmationDialogComponent } from '@ws/services/confirmation/dialog/dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [WsConfirmationDialogComponent],
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule, TranslocoModule],
  providers: [WsConfirmationService],
})
export class WsConfirmationModule {
  /**
   * 构造函数
   */
  constructor(private _wsConfirmationService: WsConfirmationService) {}
}
