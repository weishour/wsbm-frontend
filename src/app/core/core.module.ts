import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthModule } from 'app/core/auth/auth.module';
import { IconsModule } from 'app/core/icons/icons.module';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';

@NgModule({
  imports: [AuthModule, IconsModule, TranslocoCoreModule],
})
export class CoreModule {
  /**
   * 构造函数
   */
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    // 不允许多次注入
    if (parentModule) {
      throw new Error('CoreModule已经被加载。只在AppModule中导入该模块。');
    }
  }
}
