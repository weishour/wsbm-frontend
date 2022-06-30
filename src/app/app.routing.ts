import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  // 重定向空路径到'/bookmark/home'
  { path: '', pathMatch: 'full', redirectTo: 'bookmark/home' },

  // 重定向已登录用户到'/bookmark/home'
  //
  // 用户登录后，登录页面将用户重定向到“sign -in-redirect”路径。下面是该路径的
  // 另一个重定向，用于将用户重定向到所需的位置。这是一个小小的方便，可以将所有的主
  // 要路径都放在这个文件中.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'bookmark/home' },

  // 游客的授权路由
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
      showSetting: false,
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () =>
          import('app/modules/auth/confirmation-required/confirmation-required.module').then(
            (m) => m.AuthConfirmationRequiredModule,
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('app/modules/auth/forgot-password/forgot-password.module').then(
            (m) => m.AuthForgotPasswordModule,
          ),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('app/modules/auth/reset-password/reset-password.module').then(
            (m) => m.AuthResetPasswordModule,
          ),
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('app/modules/auth/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('app/modules/auth/sign-up/sign-up.module').then((m) => m.AuthSignUpModule),
      },
    ],
  },

  // 认证用户的授权路由
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
      showSetting: false,
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () =>
          import('app/modules/auth/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
      },
      {
        path: 'unlock-session',
        loadChildren: () =>
          import('app/modules/auth/unlock-session/unlock-session.module').then(
            (m) => m.AuthUnlockSessionModule,
          ),
      },
    ],
  },

  // 登录页路由
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('app/modules/landing/home/home.module').then((m) => m.LandingHomeModule),
      },
    ],
  },

  // 管理页路由
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'bookmark/:group',
        loadChildren: () =>
          import('app/modules/admin/bookmark/bookmark.module').then((m) => m.BookmarkModule),
      },
      // 错误页
      {
        path: 'error',
        children: [
          {
            path: '400',
            loadChildren: () =>
              import('app/modules/error/400/error-400.module').then((m) => m.Error400Module),
          },
          {
            path: '403',
            loadChildren: () =>
              import('app/modules/error/403/error-403.module').then((m) => m.Error403Module),
          },
          {
            path: '404',
            loadChildren: () =>
              import('app/modules/error/404/error-404.module').then((m) => m.Error404Module),
          },
          {
            path: '500',
            loadChildren: () =>
              import('app/modules/error/500/error-500.module').then((m) => m.Error500Module),
          },
          {
            path: 'network-error',
            loadChildren: () =>
              import('app/modules/error/network-error/network-error.module').then(
                (m) => m.NetworkErrorModule,
              ),
          },
          {
            path: 'not-data',
            loadChildren: () =>
              import('app/modules/error/not-data/not-data.module').then((m) => m.NotDataModule),
          },
        ],
      },
      // 未找到页面
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];
