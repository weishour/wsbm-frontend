import { NgModule } from '@angular/core';
import { WsPlatformService } from '@ws/services/platform/platform.service';

@NgModule({
  providers: [WsPlatformService],
})
export class WsPlatformModule {
  /**
   * 构造函数
   */
  constructor(private _wsPlatformService: WsPlatformService) {}
}
