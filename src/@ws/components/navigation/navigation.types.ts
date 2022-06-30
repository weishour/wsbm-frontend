import { IsActiveMatchOptions, Params, QueryParamsHandling } from '@angular/router';
export interface WsNavigationItem {
  /** 导航项的唯一ID */
  id?: string;
  /** 导航项的标题 */
  title?: string;
  /** 导航项的翻译键名 */
  translation?: string;
  /** 导航项的副标题 */
  subtitle?: string;
  /** 导航项的类型 */
  type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
  /** 是否隐藏导航项 */
  hidden?: (item: WsNavigationItem) => boolean;
  /** 是否强制导航项处于活动状态 */
  active?: boolean;
  /** 导航项是否被禁用 */
  disabled?: boolean;
  /** 导航项的工具提示 (空字符串将删除工具提示) */
  tooltip?: string;
  /** 导航项链接 (路由链接或者是外部链接) */
  link?: string;
  /** 设置URL的哈希片段 */
  fragment?: string;
  /** 当为真时，为下一次导航保留URL片段 */
  preserveFragment?: boolean;
  /** 为URL设置查询参数 */
  queryParams?: Params | null;
  /** 如何处理下一个导航的路由器链接中的查询参数 */
  queryParamsHandling?: QueryParamsHandling | null;
  /** link是否被解析为外部链接 */
  externalLink?: boolean;
  /** 外部链接的目标属性 */
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  /** 在[routerLinkActiveOptions]上设置确切的参数 */
  exactMatch?: boolean;
  /** 在[routerLinkActiveOptions]上设置isActiveMatchOptions对象。如果提供，exactMatch选项将被忽略 */
  isActiveMatchOptions?: IsActiveMatchOptions;
  /** 点击导航的自定义功能 */
  function?: (event: MouseEvent, item: WsNavigationItem) => void;
  /** 导航项特定部分的自定义类名 */
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  /** 图标 */
  icon?: string;
  /** 徽章 */
  badge?: {
    title?: string;
    classes?: string;
  };
  /** 排序 */
  sort?: number;
  /** 导航的子级导航项数组 */
  children?: WsNavigationItem[];
  /** 保存导航项的自定义数据的对象 */
  meta?: any;
}

export type WsVerticalNavigationAppearance = 'default' | 'compact' | 'dense' | 'thin';

export type WsVerticalNavigationMode = 'over' | 'side';

export type WsVerticalNavigationPosition = 'left' | 'right';
