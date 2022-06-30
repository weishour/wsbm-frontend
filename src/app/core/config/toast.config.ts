import { ToastConfig } from "@ngneat/hot-toast";

/**
 * toast全局配置
 */
export const toastConfig: Partial<ToastConfig> = {
  /** 堆叠顺序 */
  reverseOrder: false,
  /** 持续时间(毫秒) */
  duration: 2000,
  /** 持续时间后自动关闭 */
  autoClose: true,
  /** 位置 */
  position: 'top-center',
  /** 显示关闭按钮 */
  dismissible: false,
  role: 'status',
  ariaLive: 'polite',
  /** 外观主题 */
  theme: 'toast',
  /** error配置 */
  error: {
    duration: 3000,
  },
  /** loading配置 */
  loading: {
    duration: 10000,
  }
};
