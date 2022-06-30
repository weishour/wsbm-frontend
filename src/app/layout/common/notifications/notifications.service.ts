import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 通知访问器
   */
  get notifications$(): Observable<Notification[]> {
    return this._notifications.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取所有通知
   */
  getAll(): Observable<Notification[]> {
    return this._httpClient.get<Notification[]>('api/common/notifications').pipe(
      tap(notifications => {
        this._notifications.next(notifications);
      }),
    );
  }

  /**
   * 创建一个通知
   *
   * @param notification
   */
  create(notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient.post<Notification>('api/common/notifications', { notification }).pipe(
          map(newNotification => {
            // 使用新通知更新通知
            this._notifications.next([...notifications, newNotification]);

            // 从可观察对象返回新的通知
            return newNotification;
          }),
        ),
      ),
    );
  }

  /**
   * 更新通知
   *
   * @param id
   * @param notification
   */
  update(id: string, notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient
          .patch<Notification>('api/common/notifications', {
            id,
            notification,
          })
          .pipe(
            map((updatedNotification: Notification) => {
              // 找到更新通知的索引
              const index = notifications.findIndex(item => item.id === id);

              // 更新通知
              notifications[index] = updatedNotification;

              // 更新通知
              this._notifications.next(notifications);

              // 返回更新的通知
              return updatedNotification;
            }),
          ),
      ),
    );
  }

  /**
   * 删除通知
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient.delete<boolean>('api/common/notifications', { params: { id } }).pipe(
          map((isDeleted: boolean) => {
            // 找到已删除通知的索引
            const index = notifications.findIndex(item => item.id === id);

            // 删除通知
            notifications.splice(index, 1);

            // 更新通知
            this._notifications.next(notifications);

            // 返回已删除状态
            return isDeleted;
          }),
        ),
      ),
    );
  }

  /**
   * 将所有通知标记为已读
   */
  markAllAsRead(): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap(notifications =>
        this._httpClient.get<boolean>('api/common/notifications/mark-all-as-read').pipe(
          map((isUpdated: boolean) => {
            // 浏览所有通知并将其设置为已读
            notifications.forEach((notification, index) => {
              notifications[index].read = true;
            });

            // 更新通知
            this._notifications.next(notifications);

            // 返回已更新状态
            return isUpdated;
          }),
        ),
      ),
    );
  }
}
