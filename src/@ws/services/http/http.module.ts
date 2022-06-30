import { NgModule } from '@angular/core';
import { INTERCEPTOR_PROVIDES } from '@ws/services/http/interceptors';

@NgModule({
  providers: [
    ...INTERCEPTOR_PROVIDES,
  ],
})
export class WsHttpModule {}
