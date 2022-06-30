import { Injectable } from '@angular/core';
import { Result } from '@ws/interfaces';
import { WsHttpService } from '@ws/services/http';
import { Observable, switchMap, of } from 'rxjs';
import { AddLabelGroupDto, EditLabelGroupDto, LabelGroup } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class LabelGroupService {
  /**
   * 构造函数
   */
  constructor(private _wsHttpService: WsHttpService) {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 添加分组数据
   */
  add(addLabelGroupDto: AddLabelGroupDto): Observable<LabelGroup> {
    return this._wsHttpService.post<Result<LabelGroup>>('label-groups/add', addLabelGroupDto).pipe(
      switchMap((result) => {
        const labelGroup: LabelGroup = result.data;
        return of(labelGroup);
      }),
    );
  }

  /**
   * 修改分组数据
   */
  edit(editLabelGroupDto: EditLabelGroupDto): Observable<LabelGroup> {
    return this._wsHttpService.post<Result<LabelGroup>>('label-groups/edit', editLabelGroupDto).pipe(
      switchMap((result) => {
        const labelGroup: LabelGroup = result.data;
        return of(labelGroup);
      }),
    );
  }

  /**
   * 删除分组数据
   */
  remove(id: number): Observable<LabelGroup> {
    return this._wsHttpService.post<Result<LabelGroup>>('label-groups/remove', { id }).pipe(
      switchMap((result) => {
        const labelGroup: LabelGroup = result.data;
        return of(labelGroup);
      }),
    );
  }

  /**
   * 分组数据排序
   */
  sort(menuId: string, ids: number[]): Observable<LabelGroup> {
    return this._wsHttpService.post<Result<LabelGroup>>('label-groups/sort', { menuId, ids }).pipe(
      switchMap((result) => {
        const navigation: LabelGroup = result.data;
        return of(navigation);
      }),
    );
  }

  /**
   * 获取当前分类标签分组数据
   */
  getClassifyGroups(menuId: string): Observable<LabelGroup[]> {
    return this._wsHttpService.get<Result<LabelGroup[]>>('label-groups', { menuId }, { toast: false }).pipe(
      switchMap((result) => {
        const labelGroups: LabelGroup[] = result.data;
        return of(labelGroups);
      }),
    );
  }
}
