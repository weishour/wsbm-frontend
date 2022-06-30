import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotDataComponent } from 'app/modules/error/not-data/not-data.component';
import { TranslocoModule } from '@ngneat/transloco';

const notDataRoutes: Route[] = [
  {
    path: '',
    component: NotDataComponent,
  },
];

@NgModule({
  declarations: [NotDataComponent],
  imports: [RouterModule.forChild(notDataRoutes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotDataModule {}
