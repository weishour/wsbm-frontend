export declare type UserMenusType = 'basic' | 'divider';
export const menuIds = <const>['profile', 'settings', 'logout'];
export declare type MenuIds = typeof menuIds[number];

export interface WsUserMenusConfig {
  // 菜单类别
  type: UserMenusType;
  // 标记
  id?: MenuIds;
  // 图标
  icon?: string;
  // 名称
  name?: string;
  // 翻译键名
  translate?: string;
}
