import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Result } from '@ws/interfaces';
import { WsHttpService } from '@ws/services/http';
import { WsMessageService } from '@ws/services/message';
import {
  WsNavigationItem,
  WsNavigationService,
  WsVerticalNavigationComponent,
} from '@ws/components/navigation';
import { AuthService } from 'app/core/auth';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { AddMenuDto, EditMenuDto } from './interfaces';
import { remove } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  /**
   * 构造函数
   */
  constructor(
    private _router: Router,
    private _httpClient: HttpClient,
    private _wsHttpService: WsHttpService,
    private _authService: AuthService,
    private _wsNavigationService: WsNavigationService,
    private _wsMessageService: WsMessageService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 导航访问器
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取所有导航数据
   */
  get(): Observable<Navigation> {
    return this._wsHttpService.get<Result<WsNavigationItem[]>>('menus', {}, { toast: false }).pipe(
      switchMap((result) => {
        const compact = result.data.map((menu) => {
          menu.classes = { wrapper: 'ws-menu-item' };
          return menu;
        });
        const navigation: Navigation = { compact };
        this._navigation.next(navigation);
        return of(navigation);
      }),
    );
  }

  /**
   * 添加导航数据
   */
  add(addMenuDto: AddMenuDto): Observable<WsNavigationItem> {
    return this._wsHttpService.post<Result<WsNavigationItem>>('menus/add', addMenuDto).pipe(
      switchMap((result) => {
        const navigation: WsNavigationItem = result.data;
        this._mainNavigationHandle('add', navigation);
        return of(navigation);
      }),
    );
  }

  /**
   * 修改导航数据
   */
  edit(editMenuDto: EditMenuDto): Observable<WsNavigationItem> {
    return this._wsHttpService.post<Result<WsNavigationItem>>('menus/edit', editMenuDto).pipe(
      switchMap((result) => {
        const navigation: WsNavigationItem = result.data;
        this._mainNavigationHandle('edit', navigation);
        return of(navigation);
      }),
    );
  }

  /**
   * 删除导航数据
   */
  remove(id: string): Observable<WsNavigationItem> {
    return this._wsHttpService.post<Result<WsNavigationItem>>('menus/remove', { id }).pipe(
      switchMap((result) => {
        const navigation: WsNavigationItem = result.data;
        this._mainNavigationHandle('remove', navigation);
        return of(navigation);
      }),
    );
  }

  /**
   * 导航数据排序
   */
  sort(ids: string[]): Observable<WsNavigationItem> {
    return this._wsHttpService.post<Result<WsNavigationItem>>('menus/sort', { ids }).pipe(
      switchMap((result) => {
        const navigation: WsNavigationItem = result.data;
        return of(navigation);
      }),
    );
  }

  /**
   * 导航到
   * @param {string} url
   */
  goTo(url: string): void {
    setTimeout(() => this._router.navigateByUrl(url));
  }

  /**
   * 导航到新标签页
   * @param {string} url
   */
  goToNewTab(url: string): void {
    window.open(url, '_blank', 'noopener');
  }

  /**
   * 导航到登录页面
   */
  toLogin(message = '登录超时'): void {
    // 登出
    this._authService.signOut(false);

    const toastRef = this._wsMessageService.toast('loading', `${message}，即将重新登录！`, {
      duration: 2000,
    });

    toastRef.afterClosed.subscribe((_) => {
      // 重新加载应用程序
      location.reload();
    });
  }

  /**
   * 导航组件数据更改
   * @param action
   * @param {WsNavigationItem} navigationItem
   * @returns void
   */
  private _mainNavigationHandle(
    action: 'add' | 'edit' | 'remove',
    navigationItem: WsNavigationItem,
  ): void {
    // 获取组件->导航数据->项
    const navComponent =
      this._wsNavigationService.getComponent<WsVerticalNavigationComponent>('mainNavigation');

    // 如果导航组件不存在，则返回
    if (!navComponent) return;

    // 获取平面导航数据
    const navigation = navComponent.navigation;

    switch (action) {
      // 添加
      case 'add':
        navigationItem.classes = { wrapper: 'ws-menu-item' };
        navComponent.navigation = [...navigation, navigationItem];
        break;
      // 修改
      case 'edit':
        const item = this._wsNavigationService.getItem(navigationItem.id, navigation);
        item.icon = navigationItem.icon;
        item.title = navigationItem.title;
        item.link = navigationItem.link;
        break;
      // 删除
      case 'remove':
        remove(navigation, ['id', navigationItem.id]);
        navComponent.navigation = navigation;
        break;
    }

    // 导航组件刷新
    navComponent.refresh();

    // 更新导航数据
    this._navigation.next({ compact: navComponent.navigation });
  }
}
