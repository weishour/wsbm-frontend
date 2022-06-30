import { NgModule, Optional, SkipSelf } from '@angular/core';
import { WsConfirmationModule } from '@ws/services/confirmation';
import { WsHttpModule } from '@ws/services/http';
import { WsLoadingModule } from '@ws/services/loading';
import { WsMediaWatcherModule } from '@ws/services/media-watcher';
import { WsMessageModule } from '@ws/services/message';
import { WsPlatformModule } from '@ws/services/platform';
import { WsSplashScreenModule } from '@ws/services/splash-screen';
import { WsStorageModule } from '@ws/services/storage';
import { SyncfusionModule } from '@ws/services/syncfusion';
import { WsUtilsModule } from '@ws/services/utils';
import { MATERIAL_PROVIDES, LOCATION_PROVIDES } from '@ws/providers';

@NgModule({
  imports: [
    WsConfirmationModule,
    WsHttpModule,
    WsLoadingModule,
    WsMediaWatcherModule,
    WsMessageModule,
    WsPlatformModule,
    WsSplashScreenModule,
    WsStorageModule,
    SyncfusionModule,
    WsUtilsModule,
  ],
  providers: [
    ...MATERIAL_PROVIDES,
    ...LOCATION_PROVIDES,
  ],
})
export class WsModule {
  /**
   * 构造函数
   */
  constructor(@Optional() @SkipSelf() parentModule?: WsModule) {
    if (parentModule) {
      throw new Error('WsModule已经被加载。只在AppModule中导入该模块!');
    }
  }
}
