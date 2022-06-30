import { ModuleWithProviders, NgModule } from '@angular/core';
import { WS_APP_CONFIG } from '@ws/services/config/config.constants';
import { AppConfig } from 'app/core/config';

@NgModule()
export class WsConfigModule {
  /**
   * 构造函数
   */
  constructor() {}

  /**
   * forRoot设置用户配置的方法
   *
   * @param config
   */
  static forRoot(config: AppConfig): ModuleWithProviders<WsConfigModule> {
    const systemConfig = localStorage.getItem('system-config') ?? '';
    config = systemConfig === '' ? config : JSON.parse(systemConfig);

    return {
      ngModule: WsConfigModule,
      providers: [
        {
          provide: WS_APP_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
