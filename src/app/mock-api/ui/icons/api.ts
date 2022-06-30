import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { WsMockApiService } from '@ws/lib/mock-api';
import {
  feather,
  heroicons,
  iconsmind,
  material,
  label_classify,
  ws,
} from 'app/mock-api/ui/icons/data';

@Injectable({
  providedIn: 'root',
})
export class IconsMockApi {
  private readonly _feather: any = feather;
  private readonly _heroicons: any = heroicons;
  private readonly _iconsmind: any = iconsmind;
  private readonly _material: any = material;
  private readonly _label_classify: any = label_classify;
  private readonly _ws: any = ws;

  /**
   * 构造函数
   */
  constructor(private _wsMockApiService: WsMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // ----------------------------------------------------------------------------
    // @ Feather icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/feather').reply(() => [
      200,
      {
        namespace: 'feather',
        name: 'Feather',
        grid: 'icon-size-6',
        list: cloneDeep(this._feather),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Heroicons outline icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/heroicons-outline').reply(() => [
      200,
      {
        namespace: 'heroicons_outline',
        name: 'Heroicons Outline',
        grid: 'icon-size-6',
        list: cloneDeep(this._heroicons),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Heroicons solid icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/heroicons-solid').reply(() => [
      200,
      {
        namespace: 'heroicons_solid',
        name: 'Heroicons Solid',
        grid: 'icon-size-5',
        list: cloneDeep(this._heroicons),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Iconsmind icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/iconsmind').reply(() => [
      200,
      {
        namespace: 'iconsmind',
        name: 'Iconsmind',
        grid: 'icon-size-10',
        list: cloneDeep(this._iconsmind),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Material solid icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/material-solid').reply(() => [
      200,
      {
        namespace: 'mat_solid',
        name: 'Material Solid',
        grid: 'icon-size-6',
        list: cloneDeep(this._material),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Material outline icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/material-outline').reply(() => [
      200,
      {
        namespace: 'mat_outline',
        name: 'Material Outline',
        grid: 'icon-size-6',
        list: cloneDeep(this._material),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Material twotone icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/material-twotone').reply(() => [
      200,
      {
        namespace: '',
        name: 'Material Twotone',
        grid: 'icon-size-6',
        list: cloneDeep(this._material),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Label Classify icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/label-classify').reply(() => [
      200,
      {
        namespace: 'label_classify',
        name: 'Label Classify',
        grid: 'icon-size-6',
        list: cloneDeep(this._label_classify),
      },
    ]);

    // ----------------------------------------------------------------------------
    // @ Ws icons - GET
    // ----------------------------------------------------------------------------
    this._wsMockApiService.onGet('api/ui/icons/ws').reply(() => [
      200,
      {
        namespace: 'ws',
        name: 'Ws',
        grid: 'icon-size-6',
        list: cloneDeep(this._ws),
      },
    ]);
  }
}
