import { Pipe, PipeTransform } from '@angular/core';

/**
 * 使用给定的键值对从给定源查找一个对象
 */
@Pipe({
  name: 'wsFindByKey',
  pure: false,
})
export class WsFindByKeyPipe implements PipeTransform {
  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 转换
   *
   * @param value A string or an array of strings to find from source
   * @param key Key of the object property to look for
   * @param source Array of objects to find from
   */
  transform(value: string | string[], key: string, source: any[]): any {
    // 如果给定的值是一个字符串数组…
    if (Array.isArray(value)) {
      return value.map(item => source.find(sourceItem => sourceItem[key] === item));
    }

    // 如果值是字符串…
    return source.find(sourceItem => sourceItem[key] === value);
  }
}
