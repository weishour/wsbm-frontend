import { Injectable } from '@angular/core';
import { WsDrawerComponent } from '@ws/components/drawer/drawer.component';

@Injectable({
  providedIn: 'root',
})
export class WsDrawerService {
  private _componentRegistry: Map<string, WsDrawerComponent> = new Map<string, WsDrawerComponent>();

  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 注册抽屉组件
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: WsDrawerComponent): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * 注销抽屉组件
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * 从注册表中获取抽屉组件
   *
   * @param name
   */
  getComponent(name: string): WsDrawerComponent | undefined {
    return this._componentRegistry.get(name);
  }
}
