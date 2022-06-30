import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WsConfigService } from '@ws/services/config';
import { DevUIThemeService, ColorHierarchyMap } from '@ws/services/devui-theme';
import { WsMediaWatcherService } from '@ws/services/media-watcher';
import { WsPlatformService } from '@ws/services/platform';
import { SyncfusionService } from '@ws/services/syncfusion';
import { WS_VERSION } from '@ws/version';
import { TranslocoService } from '@ngneat/transloco';
import { Layout } from 'app/layout/layout.types';
import { Themes, AppConfig } from 'app/core/config';
import { Theme, ThemeService } from 'ng-devui/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, map } from 'rxjs';
import { isUndefined, find } from 'lodash';

@UntilDestroy()
@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  count = 0;
  config: AppConfig;
  layout: Layout;
  scheme: 'dark' | 'light';
  theme: string;
  themes: Themes;
  isDark: boolean;
  showSetting: boolean;
  devuiThemeService: ThemeService;

  /**
   * 构造函数
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router,
    private _renderer2: Renderer2,
    private _activatedRoute: ActivatedRoute,
    private _translocoService: TranslocoService,
    private _wsConfigService: WsConfigService,
    private _wsMediaWatcherService: WsMediaWatcherService,
    private _wsPlatformService: WsPlatformService,
    private _devUIThemeService: DevUIThemeService,
    private _syncfusionService: SyncfusionService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.devuiThemeService = window['devuiThemeService'];
    }

    // 根据配置情况设置主题和方案
    combineLatest([
      this._wsConfigService.config$,
      this._wsMediaWatcherService.onMediaQueryChange$([
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)',
      ]),
    ])
      .pipe(
        untilDestroyed(this),
        map(([config, mql]) => {
          const options = {
            scheme: config.scheme,
            theme: config.theme,
            themes: config.themes,
          };

          // 如果方案设置为“自动”
          if (config.scheme === 'auto') {
            // 使用媒体查询决定方案
            options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
          }

          return options;
        }),
      )
      .subscribe((options) => {
        this.count++;

        // 存储选项
        this.scheme = options.scheme;
        this.theme = options.theme;
        this.themes = options.themes;

        // 更新方案和主题
        this._updateScheme();
        this._updateTheme();
        this._updateDevUI();
        this._updateSyncfusion();
      });

    // 订阅配置更改
    this._wsConfigService.config$.pipe(untilDestroyed(this)).subscribe((config: AppConfig) => {
      // 存储配置
      this.config = config;

      // 更新布局
      this._updateLayout();
    });

    // 订阅NavigationEnd事件
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        // 更新布局
        this._updateLayout();
      });

    // 设置应用版本
    this._renderer2.setAttribute(
      this._document.querySelector('[ng-version]'),
      'ws-version',
      WS_VERSION,
    );

    // 设置操作系统名称
    this._renderer2.addClass(this._document.body, this._wsPlatformService.osName);
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 更新选择的布局
   */
  private _updateLayout(): void {
    // 获取当前激活的路由
    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    // 1. 从配置中设置布局
    this.layout = this.config.layout;

    // 2. 从当前路由中获取查询参数，设置布局并将布局保存到配置中
    const layoutFromQueryParam = route.snapshot.queryParamMap.get('layout') as Layout;
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
      if (this.config) {
        this.config.layout = layoutFromQueryParam;
      }
    }

    this.isDark = this.config.isDark;

    // 3.是否显示设置
    this.showSetting = this.config.showSetting;

    // 4. 遍历路径并在找到配置后更改布局.
    //
    // 我们这样做的原因是，路径上可能存在空的分组路径或无组件路由。因此，我们不能假设布局配置
    // 将在最后一个路径的配置或在第一个路径的配置.
    //
    // 因此，我们得到了所有匹配的路径，从根目录一直到当前激活的路由，逐个遍历它们，并在找到布
    // 局配置时更改布局。这样，布局配置可以在路径中的任何位置，我们不会错过它.
    //
    // 此外，这将允许重写布局在任何时候，所以我们可以有不同的布局不同的路线.
    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      if (path.routeConfig && path.routeConfig.data) {
        // 检查是否有“布局”数据
        const dataLayout = path.routeConfig.data.layout;
        if (dataLayout) {
          // 设置布局
          this.layout = dataLayout;
        }

        // 检查是否有“是否暗黑”数据
        const isDark = path.routeConfig.data.isDark;
        if (!isUndefined(isDark)) {
          // 是否暗黑
          this.isDark = isDark;
        }

        // 检查是否有“设置”数据
        const dataSetting = path.routeConfig.data.showSetting;
        if (!isUndefined(dataSetting)) {
          // 显示设置
          this.showSetting = dataSetting;
        }
      }
    });
  }

  /**
   * 更新选择的方案
   *
   * @private
   */
  private _updateScheme(): void {
    this.isDark = this.scheme === 'dark';
    this._wsConfigService.configNotNext = { isDark: this.isDark };

    // 删除所有方案的类名
    this._document.body.classList.remove('light', 'dark');

    // 为当前选择的方案添加类名
    this._document.body.classList.add(this.scheme);
  }

  /**
   * 更新选择的主题
   *
   * @private
   */
  private _updateTheme(): void {
    // 找到前面所选主题的类名并删除它
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(className, className.split('-')[1]);
      }
    });

    // 为当前选择的主题添加类名
    this._document.body.classList.add(this.theme);
  }

  /**
   * 更新DevUI主题
   *
   * @private
   */
  private _updateDevUI(): void {
    // 当前系统主题
    const currentTheme = find(this.themes, { id: this.theme });
    const isDark = this.scheme === 'dark';

    // 根据系统主题颜色改变DevUI主题
    this.devuiThemeService.applyTheme(
      new Theme({
        id: this.theme,
        name: this.theme,
        cnName: this._translocoService.translate(`settings.${currentTheme['name']}`, {}, 'zh'),
        data: this._devUIThemeService.genThemeData(
          [
            {
              colorName: 'devui-brand',
              color: currentTheme['color'],
            },
            {
              colorName: 'devui-base-bg',
              color: isDark ? '#1e293b' : ColorHierarchyMap['devui-base-bg']['default-value'],
            },
            {
              colorName: 'devui-connected-overlay-bg',
              color: isDark ? '#1e293b' : '',
            },
            {
              colorName: 'devui-danger',
              color: '#f44336',
            },
            {
              colorName: 'devui-warning',
              color: '#ffc107',
            },
            {
              colorName: 'devui-success',
              color: '#4caf50',
            },
            {
              colorName: 'devui-info',
              color: '#2196F3',
            },
          ],
          isDark,
          'hsl',
        ),
        isDark,
      }),
    );
  }

  /**
   * 更新Syncfusion主题
   *
   * @private
   */
  private async _updateSyncfusion(): Promise<void> {
    this.count > 1 && await this._syncfusionService.load(this.theme);
  }
}
