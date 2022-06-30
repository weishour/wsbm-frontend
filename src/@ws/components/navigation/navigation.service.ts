import { Injectable } from '@angular/core';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';

@Injectable({
  providedIn: 'root',
})
export class WsNavigationService {
  private _componentRegistry: Map<string, any> = new Map<string, any>();
  private _navigationStore: Map<string, WsNavigationItem[]> = new Map<string, any>();

  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 注册导航组件
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: any): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * 取消注册导航组件
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * 从注册表中获取导航组件
   *
   * @param name
   */
  getComponent<T>(name: string): T {
    return this._componentRegistry.get(name);
  }

  /**
   * 用给定的键存储给定的导航
   *
   * @param key
   * @param navigation
   */
  storeNavigation(key: string, navigation: WsNavigationItem[]): void {
    // Add to the store
    this._navigationStore.set(key, navigation);
  }

  /**
   * 通过键从存储器获取导航
   *
   * @param key
   */
  getNavigation(key: string): WsNavigationItem[] {
    return this._navigationStore.get(key) ?? [];
  }

  /**
   * 删除存储中的指定键的导航
   *
   * @param key
   */
  deleteNavigation(key: string): void {
    // 检查导航是否存在
    if (!this._navigationStore.has(key)) {
      console.warn(`Navigation with the key '${key}' does not exist in the store.`);
    }

    // 从存储中删除
    this._navigationStore.delete(key);
  }

  /**
   * 返回给定导航数组的平化版本的实用函数
   *
   * @param navigation
   * @param flatNavigation
   */
  getFlatNavigation(
    navigation: WsNavigationItem[],
    flatNavigation: WsNavigationItem[] = [],
  ): WsNavigationItem[] {
    for (const item of navigation) {
      if (item.type === 'basic') {
        flatNavigation.push(item);
        continue;
      }

      if (item.type === 'aside' || item.type === 'collapsable' || item.type === 'group') {
        if (item.children) {
          this.getFlatNavigation(item.children, flatNavigation);
        }
      }
    }

    return flatNavigation;
  }

  /**
   * 从给定导航返回具有给定id的项的实用函数
   *
   * @param id
   * @param navigation
   */
  getItem(id: string, navigation: WsNavigationItem[]): WsNavigationItem | null {
    for (const item of navigation) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const childItem = this.getItem(id, item.children);

        if (childItem) {
          return childItem;
        }
      }
    }

    return null;
  }

  /**
   * 从给定的导航返回具有给定id的项的父项的实用函数
   *
   * @param id
   * @param navigation
   * @param parent
   */
  getItemParent(
    id: string,
    navigation: WsNavigationItem[],
    parent: WsNavigationItem[] | WsNavigationItem,
  ): WsNavigationItem[] | WsNavigationItem | null {
    for (const item of navigation) {
      if (item.id === id) {
        return parent;
      }

      if (item.children) {
        const childItem = this.getItemParent(id, item.children, item);

        if (childItem) {
          return childItem;
        }
      }
    }

    return null;
  }
}
