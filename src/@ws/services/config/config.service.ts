import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@ws/services/storage';
import { WS_APP_CONFIG } from '@ws/services/config/config.constants';
import { AppConfig } from 'app/core/config';
import { BehaviorSubject, Observable } from 'rxjs';
import { merge } from 'lodash-es';
import type { SafeAny } from '@ws/types';

@Injectable({
  providedIn: 'root',
})
export class WsConfigService {
  private _config: BehaviorSubject<SafeAny>;

  /**
   * 构造函数
   */
  constructor(@Inject(WS_APP_CONFIG) config: SafeAny, private _storageService: StorageService) {
    this.setSystemConfig(config);

    // 私有
    this._config = new BehaviorSubject(config);
  }

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  get config$(): Observable<SafeAny> {
    return this._config.asObservable();
  }

  /**
   * 获取当前系统配置
   */
  get currentConfig(): Partial<AppConfig> {
    return this._config.value;
  }

  /**
   * 设置配置
   */
  set config(value: SafeAny) {
    this.setConfig(value);
  }

  /**
   * 设置配置 (不通知订阅)
   */
  set configNotNext(value: SafeAny) {
    this.setConfig(value, false);
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 将配置重置为默认值
   */
  reset(): void {
    this.setSystemConfig(this.config);

    // 设置配置
    this._config.next(this.config);
  }

  /**
   * 将系统配置存储
   * @param {SafeAny} value
   * @param {boolean} isNext
   */
  private setConfig(value: SafeAny, isNext: boolean = true): void {
    // 将新配置合并到当前配置
    const config = merge({}, this._config.getValue(), value);

    this.setSystemConfig(config);

    // 执行可观察对象
    isNext && this._config.next(config);
  }

  /**
   * 将系统配置存储在本地存储中
   * @param {SafeAny} config
   */
  private setSystemConfig(config: SafeAny): void {
    this._storageService.set('system-config', config);
  }
}
