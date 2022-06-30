import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Message } from 'app/layout/common/messages/messages.types';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _messages: ReplaySubject<Message[]> = new ReplaySubject<Message[]>(1);

  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 消息访问器
   */
  get messages$(): Observable<Message[]> {
    return this._messages.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取所有的消息
   */
  getAll(): Observable<Message[]> {
    return this._httpClient.get<Message[]>('api/common/messages').pipe(
      tap(messages => {
        this._messages.next(messages);
      }),
    );
  }

  /**
   * 创建消息
   *
   * @param message
   */
  create(message: Message): Observable<Message> {
    return this.messages$.pipe(
      take(1),
      switchMap(messages =>
        this._httpClient.post<Message>('api/common/messages', { message }).pipe(
          map(newMessage => {
            // 使用新消息更新消息
            this._messages.next([...messages, newMessage]);

            // 返回可观察对象的新消息
            return newMessage;
          }),
        ),
      ),
    );
  }

  /**
   * 更新消息
   *
   * @param id
   * @param message
   */
  update(id: string, message: Message): Observable<Message> {
    return this.messages$.pipe(
      take(1),
      switchMap(messages =>
        this._httpClient
          .patch<Message>('api/common/messages', {
            id,
            message,
          })
          .pipe(
            map((updatedMessage: Message) => {
              // 找到更新后的消息的索引
              const index = messages.findIndex(item => item.id === id);

              // 更新消息
              messages[index] = updatedMessage;

              // 更新消息
              this._messages.next(messages);

              // 返回更新后的消息
              return updatedMessage;
            }),
          ),
      ),
    );
  }

  /**
   * 删除消息
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.messages$.pipe(
      take(1),
      switchMap(messages =>
        this._httpClient.delete<boolean>('api/common/messages', { params: { id } }).pipe(
          map((isDeleted: boolean) => {
            // 找到已删除邮件的索引
            const index = messages.findIndex(item => item.id === id);

            // 删除消息
            messages.splice(index, 1);

            // 更新消息
            this._messages.next(messages);

            // 返回已删除状态
            return isDeleted;
          }),
        ),
      ),
    );
  }

  /**
   * 标记所有的消息为已读
   */
  markAllAsRead(): Observable<boolean> {
    return this.messages$.pipe(
      take(1),
      switchMap(messages =>
        this._httpClient.get<boolean>('api/common/messages/mark-all-as-read').pipe(
          map((isUpdated: boolean) => {
            // 浏览所有消息并将其设置为已读
            messages.forEach((message, index) => {
              messages[index].read = true;
            });

            // 更新消息
            this._messages.next(messages);

            // 返回已更新的状态
            return isUpdated;
          }),
        ),
      ),
    );
  }
}
