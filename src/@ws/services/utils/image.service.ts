import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WsImageService {
  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * dataUrl转为File对象
   * @param {string} dataurl
   * @param {string} fileName
   * @returns File
   */
   dataURLtoFile(dataurl: string, fileName: string): File {
    // 去掉dataUrl头部，取到base64
    const base64 = window.atob(dataurl.split(',')[1]);
    // 从dataUrl头部获取文件类型
    const type = dataurl.split(',')[0].match(/:(.*?);/)[1];
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(base64.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < base64.length; i++) {
      ia[i] = base64.charCodeAt(i);
    }

    const blob = new Blob([ab], { type }); // Blob对象
    const file = new File([blob], fileName + '.png', { type }); // File对象

    return file;
  }
}
