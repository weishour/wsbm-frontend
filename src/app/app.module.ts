import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { WsModule } from '@ws';
import { WsConfigModule } from '@ws/services/config';
import { DevUIThemeModule } from '@ws/services/devui-theme';
import { WsMockApiModule } from '@ws/lib/mock-api';
import { THIRD_MODULES } from '@ws/modules';
import { CoreModule } from 'app/core/core.module';
import { appConfig, routerConfig } from 'app/core/config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    QuicklinkModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // WsModule, WsConfig & WsMockAPI
    WsModule,
    WsConfigModule.forRoot(appConfig),
    WsMockApiModule.forRoot(mockApiServices),

    // DevUI全局配置
    DevUIThemeModule.forRoot({
      global: {
        showAnimation: true,
      },
    }),

    // 核心模块
    CoreModule,

    // 布局模块
    LayoutModule,

    // 需要通过forRoot进行全局配置的第三方模块
    ...THIRD_MODULES,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
