import { Injectable } from '@angular/core';
import { Result } from '@ws/interfaces';
import { WsHttpService } from '@ws/services/http';
import { Observable, switchMap, of } from 'rxjs';
import { EditLabelDto, Label } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  /**
   * 构造函数
   */
  constructor(private _wsHttpService: WsHttpService) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 添加标签
   */
  add(addLabelDto: FormData): Observable<Label> {
    return this._wsHttpService.post<Result<Label>>('labels/add', addLabelDto).pipe(
      switchMap((result) => {
        const label: Label = result.data;
        return of(label);
      }),
    );
  }

  /**
   * 修改标签
   */
  edit(editLabelDto: FormData): Observable<Label> {
    return this._wsHttpService.post<Result<Label>>('labels/edit', editLabelDto).pipe(
      switchMap((result) => {
        const label: Label = result.data;
        return of(label);
      }),
    );
  }

  /**
   * 删除分组数据
   */
  remove(id: number): Observable<Label> {
    return this._wsHttpService.post<Result<Label>>('labels/remove', { id }).pipe(
      switchMap((result) => {
        const label: Label = result.data;
        return of(label);
      }),
    );
  }
}
