import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { WsConfigService } from '@ws/services/config';
import { AppConfig, Scheme, Theme, Themes } from 'app/core/config';
import { Layout } from 'app/layout/layout.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styles: [
    `
      settings {
        position: static;
        display: block;
        flex: none;
        width: auto;
      }

      @media (screen and min-width: 1280px) {
        empty-layout + settings .settings-cog {
          right: 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  config: AppConfig;
  layout: Layout;
  scheme: 'dark' | 'light';
  theme: string;
  themes: Themes;
  classConstant = 'bg-gray-300 dark:bg-gray-700';

  // 按钮是否隐藏
  @Input() buttonHidden: boolean = false;

  /**
   * 构造函数
   */
  constructor(private _router: Router, private _wsConfigService: WsConfigService) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅配置更改
    this._wsConfigService.config$.pipe(untilDestroyed(this)).subscribe((config: AppConfig) => {
      // 存储配置
      this.config = config;
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 在配置中设置布局
   *
   * @param layout
   */
  setLayout(layout: string): void {
    // 清除'layout'查询参数以允许更改布局
    this._router
      .navigate([], {
        queryParams: {
          layout: null,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        // 设置配置
        this._wsConfigService.config = { layout };
      });
  }

  /**
   * 在配置上设置外观
   *
   * @param scheme
   */
  setScheme(scheme: Scheme): void {
    this._wsConfigService.config = { scheme };
  }

  /**
   * 在配置上设置主题
   *
   * @param theme
   */
  setTheme(theme: Theme): void {
    this._wsConfigService.config = { theme };
  }
}
