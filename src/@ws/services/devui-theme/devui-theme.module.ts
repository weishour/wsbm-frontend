import { ModuleWithProviders, NgModule } from '@angular/core';
import { DevUIGlobalConfig, DevUIGlobalConfigToken } from 'ng-devui/utils';
import { DevUIThemeService } from '@ws/services/devui-theme/devui-theme.service';

@NgModule({
  providers: [DevUIThemeService],
})
export class DevUIThemeModule {
  /**
   * 构造函数
   */
  constructor(private _devUIThemeService: DevUIThemeService) {}

  /**
   * forRoot设置DevUI全局配置的方法
   *
   * @param config
   */
   static forRoot(config: DevUIGlobalConfig): ModuleWithProviders<DevUIThemeModule> {
    return {
      ngModule: DevUIThemeModule,
      providers: [
        {
          provide: DevUIGlobalConfigToken,
          useValue: config,
        },
      ],
    };
  }
}
