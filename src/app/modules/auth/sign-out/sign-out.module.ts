import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { WsCardModule } from '@ws/components/card';
import { WsLogoModule } from '@ws/components/logo';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
import { authSignOutRoutes } from 'app/modules/auth/sign-out/sign-out.routing';

@NgModule({
  declarations: [AuthSignOutComponent],
  imports: [
    RouterModule.forChild(authSignOutRoutes),
    MatButtonModule,
    WsCardModule,
    WsLogoModule,
    SharedModule,
    TranslocoModule,
  ],
})
export class AuthSignOutModule {}
