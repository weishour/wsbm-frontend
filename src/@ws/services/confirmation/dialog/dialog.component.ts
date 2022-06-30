import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WsConfirmationConfig } from '@ws/services/confirmation/confirmation.types';

@Component({
  selector: 'ws-confirmation-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    `
      .ws-confirmation-dialog-panel {
        @screen md {
          @apply w-128;
        }

        .mat-dialog-container {
          padding: 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class WsConfirmationDialogComponent {
  /**
   * 构造函数
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: WsConfirmationConfig) {}
}
