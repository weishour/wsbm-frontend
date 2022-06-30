import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Error404Component } from 'app/modules/error/404/error-404.component';
import { TranslocoModule } from '@ngneat/transloco';

const error404Routes: Route[] = [
  {
    path: '',
    component: Error404Component,
  },
];

@NgModule({
  declarations: [Error404Component],
  imports: [RouterModule.forChild(error404Routes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Error404Module {}
