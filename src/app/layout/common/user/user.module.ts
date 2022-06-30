import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WsCardModule } from '@ws/components/card';
import { MatListModule } from '@angular/material/list';
import { DropDownModule } from 'ng-devui';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [UserComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    WsCardModule,
    MatListModule,
    DropDownModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [UserComponent],
})
export class UserModule {}
