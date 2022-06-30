import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WsDrawerModule } from '@ws/components/drawer';
import { WsScrollbarModule } from '@ws/directives/scrollbar/public-api';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    WsDrawerModule,
    WsScrollbarModule,
    MatButtonModule,
    TranslocoModule,
  ],
  exports: [SettingsComponent],
})
export class SettingsModule {}
