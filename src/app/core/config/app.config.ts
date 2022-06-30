import { Layout } from 'app/layout/layout.types';

/**
 * 主题选项
 */
export const themes = <const>[
  { id: 'theme-default', name: 'Default', color: '#4f46e5' },
  { id: 'theme-brand', name: 'Brand', color: '#2196f3' },
  { id: 'theme-teal', name: 'Teal', color: '#0d9488' },
  { id: 'theme-rose', name: 'Rose', color: '#f43f5e' },
  { id: 'theme-purple', name: 'Purple', color: '#9333ea' },
  { id: 'theme-amber', name: 'Amber', color: '#f59e0b' },
];

/**
 * 外观选项
 */
export const schemes = <const>['auto', 'dark', 'light'];

/**
 * 布局选项
 */
export const layouts = <const>[
  'empty',
  // 垂直
  'classic',
  'classy',
  'compact',
  'dense',
  'futuristic',
  'thin',
  // 水平
  'centered',
  'enterprise',
  'material',
  'modern',
];

/**
 * 路由动画
 */
export const routerAnimations = <const>['none', 'fadeIn', 'slideUp', 'slideDown', 'slideRight', 'slideLeft'];

/**
 * 断点选项
 */
export const screens = <const>{ sm: '600px', md: '960px', lg: '1280px', xl: '1440px' };

// 类型
export type Scheme = typeof schemes[number];
export type Screens = Record<keyof typeof screens, string>;
export type Theme = typeof themes[number]['id'];
export type Themes = typeof themes;
export type RouterAnimations = typeof routerAnimations[number];

/**
 * AppConfig接口。更新此接口以严格键入配置对象.
 */
export interface AppConfig {
  // 布局
  layout: Layout;
  // 外观
  scheme: Scheme;
  // 断点
  screens: Screens;
  // 主题
  theme: Theme;
  // 主题列表
  themes: Themes;
  // 是否暗黑模式
  isDark: boolean;
  // 是否显示设置
  showSetting: boolean;
  // 路由动画
  routerAnimation: RouterAnimations;
}

/**
 * 整个应用程序的默认配置。该节点被WsConfigService用来设置默认配置
 *
 * 如果你需要为你的应用程序存储全局配置，你可以使用这个对象来设置默认值。
 * 要访问、更新和重置配置，请使用WsConfigService及其方法
 *
 * “Screens”被转移到BreakpointObserver，以便在组件中访问它们，它们是必需的。
 *
 * “Themes”是Tailwind生成主题所必需的。
 */
export const appConfig: AppConfig = {
  layout: layouts[3],
  scheme: schemes[0],
  screens,
  theme: themes[0]['id'],
  themes,
  isDark: false,
  showSetting: false,
  routerAnimation: routerAnimations[0],
};
