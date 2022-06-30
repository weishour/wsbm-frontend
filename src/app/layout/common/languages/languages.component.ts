import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';
import { WsNavigationService, WsVerticalNavigationComponent } from '@ws/components/navigation';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { setCulture, setCurrencyCode } from '@syncfusion/ej2-base';

@Component({
  selector: 'languages',
  templateUrl: './languages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'languages',
})
export class LanguagesComponent implements OnInit, OnDestroy {
  availableLangs: LangDefinition[];
  activeLang: string;
  flagCodes: any;
  trackByFn = this._wsUtilsService.trackByFn;

  /**
   * 构造函数
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _changeDetectorRef: ChangeDetectorRef,
    private _wsNavigationService: WsNavigationService,
    private _translocoService: TranslocoService,
    private _wsUtilsService: WsUtilsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 从transloco获取可用的语言
    this.availableLangs = this._translocoService.getAvailableLangs() as LangDefinition[];

    // 订阅语言更改
    this._translocoService.langChanges$.subscribe((activeLang) => {
      // 获取活动的语言
      this.activeLang = activeLang;

      let lang = this.activeLang;
      switch (lang) {
        case 'zh':
          lang = 'zh-CN';
          setCurrencyCode('CNY');
          break;
        case 'en':
          lang = 'en-US';
          setCurrencyCode('USD');
          break;
      }

      // 设置html的lang
      this._document.documentElement.lang = lang;

      // 更新Syncfusion国际化
      setCulture(lang);

      // 更新导航
      this._updateNavigation(activeLang);
    });

    // 设置国旗语言的国家iso代码
    this.flagCodes = {
      zh: 'cn',
      en: 'us',
    };
  }

  /**
   * 组件销毁
   */
  ngOnDestroy(): void {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 设置活动的语言
   *
   * @param lang
   */
  setActiveLang(lang: string): void {
    // 设置活动的语言
    this._translocoService.setActiveLang(lang);
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 更新导航
   *
   * @param lang
   * @private
   */
  private _updateNavigation(lang: string): void {
    // 获取组件->导航数据->项
    const navComponent =
      this._wsNavigationService.getComponent<WsVerticalNavigationComponent>('mainNavigation');

    // 如果导航组件不存在，则返回
    if (!navComponent) return;

    // 获取平面导航数据
    const navigation = navComponent.navigation;

    // 主页
    const homeItem = this._wsNavigationService.getItem('home', navigation);
    if (homeItem) {
      this._translocoService
        .selectTranslate('navigation.home')
        .pipe(take(1))
        .subscribe((translation) => {
          // 设置标题
          homeItem.title = translation;

          // 刷新导航组件
          navComponent.refresh();
        });
    }
  }

  /**
   * 下拉状态
   *
   * @param {boolean} event
   */
  onToggle(event: boolean): void {}
}
