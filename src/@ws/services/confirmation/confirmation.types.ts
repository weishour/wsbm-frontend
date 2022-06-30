export declare type ColorType = 'primary' | 'accent' | 'warn';
export declare type ConfirmationIconType = 'basic' | 'info' | 'success' | 'warning' | 'error';

export interface WsConfirmationConfig {
  // 标题 (允许使用 HTML)
  title?: string;
  // 消息 (允许使用 HTML)
  message?: string;
  // 图标
  icon?: {
    // 是否显示
    show?: boolean;
    // 名称
    name?: string;
    // 颜色
    color?: ConfirmationIconType | ColorType;
  };
  // 动作按钮
  actions?: {
    // 确认按钮
    confirm?: {
      // 是否显示
      show?: boolean;
      // 标签
      label?: string;
      // 颜色
      color?: ColorType;
    };
    // 取消按钮
    cancel?: {
      // 是否显示
      show?: boolean;
      // 标签
      label?: string;
    };
  };
  // 是否可关闭 (如果false，则无法通过单击背景或按 Escape 键来关闭确认对话框。
  // 右上角的关闭按钮也不会显示)
  dismissible?: boolean;
}
