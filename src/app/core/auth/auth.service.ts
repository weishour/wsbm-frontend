import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WsHttpService } from '@ws/services/http';
import { StorageService } from '@ws/services/storage';
import { Result } from '@ws/interfaces';
import { ConfigProvider } from 'app/core/config';
import { RefreshDao } from 'app/core/auth/interfaces';
import { UserService, LoginDto, RegisterDto, User } from 'app/core/user';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { isEmpty } from 'lodash-es';

@Injectable()
export class AuthService {
  private _authenticated: boolean = false;

  /**
   * 构造函数
   */
  constructor(
    private _httpClient: HttpClient,
    private _wsHttpService: WsHttpService,
    private _userService: UserService,
    private _configProvider: ConfigProvider,
    private _storageService: StorageService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 获取访问令牌
   */
  get accessToken(): string {
    return this._storageService.get<string>('accessToken') ?? '';
  }

  /**
   * 获取刷新令牌
   */
  get refreshToken(): string {
    return this._storageService.get<string>('refreshToken') ?? '';
  }

  /**
   * 获取记住我状态
   */
  get rememberMe(): boolean {
    return this._storageService.get<boolean>('rememberMe') ?? false;
  }

  // ----------------------------------------------------------------------------
  // @ 设置器
  // ----------------------------------------------------------------------------

  /**
   * 设置访问令牌
   */
  set accessToken(token: string) {
    this._storageService.set('accessToken', token);
  }

  /**
   * 设置刷新令牌
   */
  set refreshToken(token: string) {
    this._storageService.set('refreshToken', token);
  }

  /**
   * 设置记住我状态
   */
  set rememberMe(status: boolean) {
    this._storageService.set('rememberMe', status);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 忘记密码
   *
   * @param username
   */
  forgotPassword(username: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', username);
  }

  /**
   * 重置密码
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * 登录
   * @param {LoginDto} credentials
   */
  signIn(credentials: LoginDto): Observable<Result<User>> {
    // 如果用户已经登录，则抛出错误
    if (this._authenticated) return throwError(() => '该用户已经登录');

    return this._wsHttpService.post<Result<User>>('auth/login', credentials).pipe(
      switchMap((result) => {
        const user = result.data;

        // 将访问令牌存储在本地存储中
        this.accessToken = user.accessToken;
        // 将刷新令牌存储在本地存储中
        this.refreshToken = user.refreshToken;
        // 将记住我状态存储在本地存储中
        this.rememberMe = credentials.rememberMe;

        // 将认证标志设置为true
        this._authenticated = true;

        // 将用户存储在用户服务上
        this._storageService.set(this._configProvider.AUTH_KEY, user),
          (this._userService.user = user);

        // 用响应返回一个新的可观察对象
        return of(result);
      }),
    );
  }

  /**
   * 注销登出
   */
  signOut(toast = true): Observable<boolean> {
    // 从本地存储中删除令牌
    this._storageService.remove('accessToken');
    this._storageService.remove('refreshToken');

    // 将认证标志设置为false
    this._authenticated = false;

    this._storageService.remove(this._configProvider.AUTH_KEY);

    // 后端用户注销
    const id = this._userService.currentUser.id;
    this._wsHttpService.post<Result<User>>('auth/logout', { id }, { toast }).subscribe();

    // 返回true
    return of(true);
  }

  /**
   * 刷新token请求
   */
  refreshTokenRequest(): Observable<Result<RefreshDao>> {
    // 刷新访问令牌
    return this._wsHttpService.post<Result<RefreshDao>>('auth/refresh', {}, { toast: false }).pipe(
      switchMap((result) => {
        const data = result.data;

        // 将访问令牌存储在本地存储中
        this.accessToken = data.accessToken;

        if (!isEmpty(data.refreshToken)) {
          // 将刷新令牌存储在本地存储中
          this.refreshToken = data.refreshToken;
        }

        // 将认证标志设置为true
        this._authenticated = true;

        // 用响应返回一个新的可观察对象
        return of(result);
      }),
    );
  }

  /**
   * 注册
   * @param {RegisterDto} registerDto
   */
  signUp(registerDto: RegisterDto): Observable<Result<User>> {
    return this._wsHttpService.post<Result<User>>('auth/register', registerDto).pipe(
      switchMap((result) => {
        // 用响应返回一个新的可观察对象
        return of(result);
      }),
    );
  }

  /**
   * 解锁屏幕
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * 检查认证状态
   */
  check(): Observable<boolean> {
    // 检查用户是否已登录
    if (this._authenticated) {
      return of(this._authenticated);
    }

    // 检查访问令牌可用性
    if (!this.accessToken) {
      return of(false);
    }

    // 返回true
    return of(true);
  }
}
