import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Chat } from 'app/layout/common/quick-chat/quick-chat.types';

@Injectable({
  providedIn: 'root',
})
export class QuickChatService {
  private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>(null);

  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 单个聊天访问器
   */
  get chat$(): Observable<Chat> {
    return this._chat.asObservable();
  }

  /**
   * 多个聊天访问器
   */
  get chats$(): Observable<Chat[]> {
    return this._chats.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取聊天记录
   */
  getChats(): Observable<any> {
    return this._httpClient.get<Chat[]>('api/apps/chat/chats').pipe(
      tap((response: Chat[]) => {
        this._chats.next(response);
      }),
    );
  }

  /**
   * 获取单个聊天
   *
   * @param id
   */
  getChatById(id: string): Observable<any> {
    return this._httpClient.get<Chat>('api/apps/chat/chat', { params: { id } }).pipe(
      map(chat => {
        // 更新聊天
        this._chat.next(chat);

        // 返回聊天
        return chat;
      }),
      switchMap(chat => {
        if (!chat) {
          return throwError(() => 'Could not found chat with id of ' + id + '!');
        }

        return of(chat);
      }),
    );
  }
}
