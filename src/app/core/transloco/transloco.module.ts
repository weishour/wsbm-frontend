import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { environment } from 'environments/environment';
import { TranslocoHttpLoader } from 'app/core/transloco/transloco.http-loader';
import { lastValueFrom } from 'rxjs';
import type { SafeAny } from '@ws/types';

@NgModule({
  imports: [TranslocoLocaleModule.forRoot()],
  providers: [
    {
      // 提供默认的Transloco配置
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        // 可用的语言
        availableLangs: [
          {
            id: 'zh',
            label: '简体中文',
          },
          {
            id: 'en',
            label: 'English',
          },
        ],
        // 设置默认语言
        defaultLang: 'zh',
        // 设置默认语言以当做备用
        fallbackLang: 'zh',
        // 是否运行时更改语言
        reRenderOnLangChange: true,
        // 是否在生产模式下运行
        prodMode: environment.production,
        // 检查优化插件
        flatten: {
          aot: environment.production,
        },
      }),
    },
    {
      // 提供默认的Transloco加载器
      provide: TRANSLOCO_LOADER,
      useClass: TranslocoHttpLoader,
    },
    {
      // 在应用程序开始前预加载默认语言，以防止空/跳跃的内容
      provide: APP_INITIALIZER,
      deps: [TranslocoService],
      useFactory:
        (translocoService: TranslocoService): SafeAny =>
        (): Promise<Translation> => {
          const defaultLang = translocoService.getDefaultLang();
          translocoService.setActiveLang(defaultLang);
          return lastValueFrom(translocoService.load(defaultLang));
        },
      multi: true,
    },
  ],
  exports: [TranslocoModule, TranslocoLocaleModule],
})
export class TranslocoCoreModule {}
