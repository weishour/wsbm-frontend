import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Error403Component } from 'app/modules/error/403/error-403.component';
import { TranslocoModule } from '@ngneat/transloco';

const error403Routes: Route[] = [
  {
    path: '',
    component: Error403Component,
  },
];

@NgModule({
  declarations: [Error403Component],
  imports: [RouterModule.forChild(error403Routes), TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Error403Module {}
