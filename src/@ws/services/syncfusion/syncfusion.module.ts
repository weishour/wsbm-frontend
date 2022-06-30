import { APP_INITIALIZER, NgModule } from '@angular/core';
import { WsConfigService } from '@ws/services/config';
import { chinese } from '@ws/services/syncfusion/i18n';
import { WS_SYNCFUSION_THEME } from '@ws/services/syncfusion/syncfusion.constants';
import { SyncfusionLoader } from '@ws/services/syncfusion/syncfusion.loader';
import { SyncfusionService } from '@ws/services/syncfusion/syncfusion.service';
import { loadCldr, L10n, enableRipple } from '@syncfusion/ej2-base';
import { lastValueFrom } from 'rxjs';
import type { SafeAny } from '@ws/types';
import ca_gregorian from 'cldr-dates-full/main/zh-Hans/ca-gregorian.json';
import timeZoneNames from 'cldr-dates-full/main/zh-Hans/timeZoneNames.json';
import numbers from 'cldr-numbers-full/main/zh-Hans/numbers.json';
import numberingSystems from 'cldr-core/supplemental/numberingSystems.json';
import currencies from 'cldr-numbers-full/main/zh-Hans/currencies.json';

// 加载CLDR数据
loadCldr(ca_gregorian, timeZoneNames, numbers, numberingSystems, currencies);

// 加载本地化语言
L10n.load(chinese.syncfusion);

// 开启涟漪动画效果
enableRipple(true);

@NgModule({
  providers: [
    {
      // 提供默认的Syncfusion加载器
      provide: WS_SYNCFUSION_THEME,
      useClass: SyncfusionLoader,
    },
    {
      // 在应用程序开始前预加载默认Syncfusion主题
      provide: APP_INITIALIZER,
      deps: [SyncfusionService, WsConfigService],
      useFactory:
        (syncfusionService: SyncfusionService, wsConfigService: WsConfigService): SafeAny =>
        async (): Promise<string> => {
          return lastValueFrom(await syncfusionService.load(wsConfigService.currentConfig.theme));
        },
      multi: true,
    },
  ],
})
export class SyncfusionModule {}
