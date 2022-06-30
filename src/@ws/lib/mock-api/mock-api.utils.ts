export class WsMockApiUtils {
  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 生成全局唯一id
   */
  static guid(): string {
    /* eslint-disable */

    let d = new Date().getTime();

    // 如果可用，使用高精度定时器
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    /* eslint-enable */
  }
}
