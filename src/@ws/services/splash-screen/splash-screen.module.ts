import { NgModule } from '@angular/core';
import { WsSplashScreenService } from '@ws/services/splash-screen/splash-screen.service';

@NgModule({
  providers: [WsSplashScreenService],
})
export class WsSplashScreenModule {
  /**
   * 构造函数
   */
  constructor(private _wsSplashScreenService: WsSplashScreenService) {}
}
