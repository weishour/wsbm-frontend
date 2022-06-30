import { ToastConfig } from "@ngneat/hot-toast";

/**
 * notification全局配置
 */
export const notificationConfig: Partial<ToastConfig> = {
  /** 堆叠顺序 */
  reverseOrder: false,
  /** 持续时间(毫秒) */
  duration: 3000,
  /** 持续时间后自动关闭 */
  autoClose: true,
  /** 位置 */
  position: 'top-right',
  /** 显示关闭按钮 */
  dismissible: true,
  role: 'status',
  ariaLive: 'polite',
  /** error配置 */
  error: {
    duration: 3000,
  },
  /** loading配置 */
  loading: {
    duration: 10000,
  },
  style: {
    minHeight: '100px',
    width: '300px',
  },
  className: 'ws-notification',
};
