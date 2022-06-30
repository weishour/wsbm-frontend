import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types';

@Injectable({
  providedIn: 'root',
})
export class ShortcutsService {
  private _shortcuts: ReplaySubject<Shortcut[]> = new ReplaySubject<Shortcut[]>(1);

  /**
   * 构造函数
   */
  constructor(private _httpClient: HttpClient) {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 捷径访问器
   */
  get shortcuts$(): Observable<Shortcut[]> {
    return this._shortcuts.asObservable();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 获取所有捷径
   */
  getAll(): Observable<Shortcut[]> {
    return this._httpClient.get<Shortcut[]>('api/common/shortcuts').pipe(
      tap(shortcuts => {
        this._shortcuts.next(shortcuts);
      }),
    );
  }

  /**
   * 新增捷径
   *
   * @param shortcut
   */
  create(shortcut: Shortcut): Observable<Shortcut> {
    return this.shortcuts$.pipe(
      take(1),
      switchMap(shortcuts =>
        this._httpClient.post<Shortcut>('api/common/shortcuts', { shortcut }).pipe(
          map(newShortcut => {
            // 用捷径数据更新捷径
            this._shortcuts.next([...shortcuts, newShortcut]);

            // 从可观察对象返回新的快捷方式
            return newShortcut;
          }),
        ),
      ),
    );
  }

  /**
   * 更新捷径
   *
   * @param id
   * @param shortcut
   */
  update(id: string, shortcut: Shortcut): Observable<Shortcut> {
    return this.shortcuts$.pipe(
      take(1),
      switchMap(shortcuts =>
        this._httpClient
          .patch<Shortcut>('api/common/shortcuts', {
            id,
            shortcut,
          })
          .pipe(
            map((updatedShortcut: Shortcut) => {
              // 找到更新后的快捷方式的索引
              const index = shortcuts.findIndex(item => item.id === id);

              // 更新捷径
              shortcuts[index] = updatedShortcut;

              // 更新捷径
              this._shortcuts.next(shortcuts);

              // 返回更新后的快捷
              return updatedShortcut;
            }),
          ),
      ),
    );
  }

  /**
   * 删除捷径
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.shortcuts$.pipe(
      take(1),
      switchMap(shortcuts =>
        this._httpClient.delete<boolean>('api/common/shortcuts', { params: { id } }).pipe(
          map((isDeleted: boolean) => {
            // 查找已删除捷径的索引
            const index = shortcuts.findIndex(item => item.id === id);

            // 删除捷径
            shortcuts.splice(index, 1);

            // 更新捷径
            this._shortcuts.next(shortcuts);

            // 返回已删除状态
            return isDeleted;
          }),
        ),
      ),
    );
  }
}
