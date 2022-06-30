import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '@ws/interfaces';
import { WsHttpService } from '@ws/services/http';
import { StorageService } from '@ws/services/storage';
import { ConfigProvider } from 'app/core/config';
import { User } from 'app/core/user';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(
    this._storageService.get<User>(this._configProvider.AUTH_KEY),
  );

  /**
   * 构造函数
   */
  constructor(
    private _httpClient: HttpClient,
    private _wsHttpService: WsHttpService,
    private _configProvider: ConfigProvider,
    private _storageService: StorageService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  /**
   * 获取当前用户信息
   */
  get currentUser(): User {
    return this._user.value;
  }

  /**
   * 设置访问器 用户
   *
   * @param value
   */
  set user(value: User) {
    // 存储值
    this._user.next(value);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取当前登录的用户数据
   */
  get(): Observable<Result<User>> {
    return this._wsHttpService
      .get<Result<User>>(`users/${this.currentUser.id}`, {}, { toast: false })
      .pipe(
        tap((result) => {
          this._user.next(result.data);
        }),
      );
  }

  /**
   * 更新用户
   *
   * @param user
   */
  update(user: User): Observable<any> {
    return this._httpClient.patch<User>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      }),
    );
  }

  /**
   * 获取所以用户数据
   */
  getAll(): Observable<Result<User[]>> {
    return this._wsHttpService.get<Result<User[]>>('users', {}, { toast: false });
  }
}
