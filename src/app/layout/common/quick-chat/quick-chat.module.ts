import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { WsDrawerModule } from '@ws/components/drawer';
import { WsScrollbarModule } from '@ws/directives/scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';

@NgModule({
  declarations: [QuickChatComponent],
  imports: [
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    WsDrawerModule,
    WsScrollbarModule,
    SharedModule,
  ],
  exports: [QuickChatComponent],
})
export class QuickChatModule {}
