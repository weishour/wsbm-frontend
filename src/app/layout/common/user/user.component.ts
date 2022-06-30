import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { WsDrawerService } from '@ws/components/drawer';
import { WsConfirmationService } from '@ws/services/confirmation';
import { UserService, User } from 'app/core/user';
import { AuthService } from 'app/core/auth/auth.service';
import { WsUserMenusConfig, MenuIds } from 'app/layout/common/user/user.types';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styles: [
    `
      .ws-button-list {
        @apply w-full;
        .mat-button-wrapper {
          @apply w-full;
          .ws-icon-right {
            width: 1.25rem !important;
            height: 1.25rem !important;
            min-width: 1.25rem !important;
            min-height: 1.25rem !important;
          }
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
})
export class UserComponent implements OnInit {
  @Input() showAvatar: boolean = true;
  user: User;

  userMenus: WsUserMenusConfig[] = [
    {
      type: 'basic',
      id: 'profile',
      icon: 'heroicons_outline:user-circle',
      translate: 'user.profile',
    },
    {
      type: 'basic',
      id: 'settings',
      icon: 'heroicons_outline:cog',
      translate: 'settings.name',
    },
    {
      type: 'divider',
    },
    {
      type: 'basic',
      id: 'logout',
      icon: 'heroicons_outline:logout',
      translate: 'user.logout',
    },
  ];

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService,
    private _authService: AuthService,
    private _wsDrawerService: WsDrawerService,
    private _wsConfirmationService: WsConfirmationService,
    private _translocoService: TranslocoService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅用户数据更改
    this._userService.user$.pipe(untilDestroyed(this)).subscribe((user: User) => {
      this.user = user;

      // 检测变更
      this._changeDetectorRef.markForCheck();
    });

    // 订阅语言更改
    this._translocoService.langChanges$.subscribe((_) => {
      this.userMenus.forEach((userMenu: WsUserMenusConfig) => {
        if (userMenu.type === 'basic') {
          this._translocoService
            .selectTranslate(userMenu?.translate)
            .pipe(take(1))
            .subscribe((translation) => translation && (userMenu.name = translation));
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 更新用户状态
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    // 如果用户不可用则返回
    if (!this.user) {
      return;
    }

    // 更新用户
    this._userService
      .update({
        ...this.user,
        status,
      })
      .subscribe();
  }

  /**
   * 切换设置
   */
  toggleSettings(): void {
    // 获取设置抽屉组件
    const settingsDrawer = this._wsDrawerService.getComponent('settingsDrawer');

    settingsDrawer.toggle();
  }

  /**
   * 登出
   */
  signOut(): void {
    const dialogRef = this._wsConfirmationService.show('warning', '系统提示', '确认要退出登录吗？');

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        // 登出
        this._authService.signOut();

        this._router.navigate(['sign-in']);
      }
    });
  }

  /**
   * 用户菜单操作
   * @param {MenuIds} id
   */
  userMenuClick(id: MenuIds): void {
    switch (id) {
      case 'profile':
        break;
      case 'settings':
        this.toggleSettings();
        break;
      case 'logout':
        this.signOut();
        break;
    }
  }

  /**
   * 下拉状态
   *
   * @param {boolean} event
   */
  onToggle(event: boolean): void {}
}
