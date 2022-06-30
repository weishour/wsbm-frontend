import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Error500Component } from 'app/modules/error/500/error-500.component';
import { TranslocoModule } from '@ngneat/transloco';

const error500Routes: Route[] = [
  {
    path: '',
    component: Error500Component,
  },
];

@NgModule({
  declarations: [Error500Component],
  imports: [RouterModule.forChild(error500Routes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Error500Module {}
