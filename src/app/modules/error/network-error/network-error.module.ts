import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NetworkErrorComponent } from 'app/modules/error/network-error/network-error.component';
import { TranslocoModule } from '@ngneat/transloco';

const networkErrorRoutes: Route[] = [
  {
    path: '',
    component: NetworkErrorComponent,
  },
];

@NgModule({
  declarations: [NetworkErrorComponent],
  imports: [RouterModule.forChild(networkErrorRoutes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NetworkErrorModule {}
