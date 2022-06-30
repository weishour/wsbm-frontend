import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { WsLogoModule } from '@ws/components/logo';
import { WsFullscreenModule } from '@ws/components/fullscreen';
import { WsLoadingBarModule } from '@ws/components/loading-bar';
import { WsNavigationModule } from '@ws/components/navigation';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { SchemesModule } from 'app/layout/common/schemes/schemes.module';
import { MessagesModule } from 'app/layout/common/messages/messages.module';
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module';
import { QuickChatModule } from 'app/layout/common/quick-chat/quick-chat.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { ShortcutsModule } from 'app/layout/common/shortcuts/shortcuts.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { CompactLayoutComponent } from 'app/layout/layouts/vertical/compact/compact.component';

@NgModule({
  declarations: [CompactLayoutComponent],
  imports: [
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    WsLogoModule,
    WsFullscreenModule,
    WsLoadingBarModule,
    WsNavigationModule,
    DialogModule,
    DropDownListModule,
    ContextMenuModule,
    LanguagesModule,
    SchemesModule,
    MessagesModule,
    NotificationsModule,
    QuickChatModule,
    SearchModule,
    ShortcutsModule,
    UserModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [CompactLayoutComponent],
})
export class CompactLayoutModule {}
