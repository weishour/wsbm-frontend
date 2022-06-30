import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { JSONSchema, StorageMap } from '@ngx-pwa/local-storage';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(public _localStorageService: LocalStorageService, public _storageMap: StorageMap) {}

  /**
   * 设置值
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
   */
  public set(key: string, value: any): boolean {
    return this._localStorageService.set(key, value);
  }

  /**
   * 获取值
   * @param {string} key
   * @returns {T}
   */
  public get<T>(key: string): T {
    return this._localStorageService.get<T>(key);
  }

  /**
   * 删除值
   * @param {string} key
   * @returns {boolean}
   */
  public remove(key: string): boolean {
    return this._localStorageService.remove(key);
  }

  /**
   * 获取值
   *
   * @param {string} key
   * @param {JSONSchema} schema
   * @returns {any}
   */
  public async getDb<T>(key: string, schema: JSONSchema): Promise<T | undefined> {
    return await firstValueFrom(this._storageMap.get<T>(key, schema));
  }

  /**
   * 设置值
   * @param {string} key
   * @param {unknown} data
   * @param {JSONSchema} schema
   * @returns
   */
  public async setDb(key: string, data: unknown, schema?: JSONSchema): Promise<undefined> {
    return await firstValueFrom(this._storageMap.set(key, data, schema));
  }

  /**
   * 删除值
   * @param {string} key
   * @returns
   */
  public async deleteDb(key: string): Promise<undefined> {
    return await firstValueFrom(this._storageMap.delete(key));
  }

  /**
   * 清空所有值
   * @returns
   */
  public async clearDb(): Promise<undefined> {
    return await firstValueFrom(this._storageMap.clear());
  }
}
