import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WS_SYNCFUSION_THEME } from '@ws/services/syncfusion/syncfusion.constants';
import { SyncfusionLoader } from '@ws/services/syncfusion/syncfusion.loader';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncfusionService {
  constructor(
    @Optional() @Inject(WS_SYNCFUSION_THEME) private loader: SyncfusionLoader,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  async load(theme: string): Promise<Observable<string>> {
    const themeCss = this.loader.getTheme(theme);
    const styleTag = this._document.getElementsByClassName('syncfusion-theme');
    styleTag[0].innerHTML = await lastValueFrom(themeCss);
    return themeCss;
  }
}
