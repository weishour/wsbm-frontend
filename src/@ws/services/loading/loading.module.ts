import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsLoadingInterceptor } from '@ws/services/loading/loading.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsLoadingInterceptor,
      multi: true,
    },
  ],
})
export class WsLoadingModule {}
