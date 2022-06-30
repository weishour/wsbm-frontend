import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Error400Component } from 'app/modules/error/400/error-400.component';
import { TranslocoModule } from '@ngneat/transloco';

const error400Routes: Route[] = [
  {
    path: '',
    component: Error400Component,
  },
];

@NgModule({
  declarations: [Error400Component],
  imports: [RouterModule.forChild(error400Routes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Error400Module {}
