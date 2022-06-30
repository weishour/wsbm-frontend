import { Injectable } from '@angular/core';
import { KeyValue } from '@angular/common';
import { IsActiveMatchOptions } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WsUtilsService {
  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 为"exact = true"获取等价的"IsActiveMatchOptions"选项。
   */
  get exactMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'exact',
    };
  }

  /**
   * 为"exact = false"获取等价的"IsActiveMatchOptions"选项。
   */
  get subsetMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'subset',
    };
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 生成一个随机id
   *
   * @param length
   */
  randomId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';

    for (let i = 0; i < 10; i++) {
      name += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return name;
  }

  /**
   * 搜索字符串
   *
   * @param {string} value
   * @param {string} searchText
   * @returns {any}
   */
  searchInString(value: string, searchText: string): boolean {
    return value.toLowerCase().includes(searchText);
  }

  /**
   * 通过函数跟踪ngFor循环
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  trackByRoute<T extends { route: string | string[] }>(index: number, item: T) {
    return item.route;
  }

  trackById<T extends { id: string | number }>(index: number, item: T) {
    return item.id;
  }

  trackByKey(index: number, item: KeyValue<any, any>) {
    return item.key;
  }

  trackByValue(index: number, value: string) {
    return value;
  }

  trackByLabel<T extends { label: string }>(index: number, value: T) {
    return value.label;
  }
}
