import { NgModule } from '@angular/core';
import { HotToastModule } from '@ngneat/hot-toast';
import { toastConfig } from 'app/core/config';

@NgModule({
  imports: [
    HotToastModule.forRoot(toastConfig),
  ],
})
export class WsMessageModule { }
