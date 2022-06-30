import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { ThemeServiceInit } from 'ng-devui/theme';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';

// 注册Syncfusion许可密钥
registerLicense(
  'ORg4AjUWIQA/Gnt2VVhiQlFadVlJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkNgWX5fcnBVRGNfV0w=',
);

/** DevUI开启主题化 */
ThemeServiceInit();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
