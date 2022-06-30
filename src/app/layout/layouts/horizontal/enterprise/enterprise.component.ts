import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsMediaWatcherService } from '@ws/services/media-watcher';
import {
  WsNavigationService,
  WsVerticalNavigationComponent,
} from '@ws/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'enterprise-layout',
  templateUrl: './enterprise.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EnterpriseLayoutComponent implements OnInit {
  isScreenSmall: boolean;
  navigation: Navigation;

  /**
   * 构造函数
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _wsMediaWatcherService: WsMediaWatcherService,
    private _wsNavigationService: WsNavigationService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 当前年份
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅导航数据
    this._navigationService.navigation$
      .pipe(untilDestroyed(this))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });

    // 订阅媒体更改
    this._wsMediaWatcherService.onMediaChange$
      .pipe(untilDestroyed(this))
      .subscribe(({ matchingAliases }) => {
        // 检查屏幕是否小
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 导航切换
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // 获取导航
    const navigation =
      this._wsNavigationService.getComponent<WsVerticalNavigationComponent>(name);

    if (navigation) {
      // 切换打开状态
      navigation.toggle();
    }
  }
}
