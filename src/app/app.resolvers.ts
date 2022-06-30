import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user';
import { IconsService } from 'app/core/icons';

@Injectable({
  providedIn: 'root',
})
export class InitialDataResolver implements Resolve<any> {
  /**
   * 构造函数
   */
  constructor(
    private _navigationService: NavigationService,
    private _userService: UserService,
    private _iconsService: IconsService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 使用此解析器解析应用程序的初始mock-api
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // 分开连接多个API端点调用，等待所有调用完成
    return forkJoin([
      this._navigationService.get(),
      this._userService.get(),
      this._iconsService.getIcons(),
    ]);
  }
}
