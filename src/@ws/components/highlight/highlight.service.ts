import { Injectable } from '@angular/core';
import hljs from 'highlight.js';

@Injectable({
  providedIn: 'root',
})
export class WsHighlightService {
  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 高亮
   */
  highlight(code: string, language: string): string {
    // 格式化代码
    code = this._format(code);

    // 突出显示并返回代码
    return hljs.highlight(code, { language }).value;
  }

  // ----------------------------------------------------------------------------
  // @ 私有方法
  // ----------------------------------------------------------------------------

  /**
   * 删除代码块周围的空行，并根据第一个非空白缩进字符重新对齐缩进
   *
   * @param code
   * @private
   */
  private _format(code: string): string {
    let indentation = 0;

    // 将代码分割成行并存储这些行
    const lines = code.split('\n');

    // 修剪代码块周围的空行
    while (lines.length && lines[0].trim() === '') {
      lines.shift();
    }

    while (lines.length && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    // 遍历这些行
    lines
      .filter(line => line.length)
      .forEach((line, index) => {
        // 总是得到第一行的缩进，这样我们可以有东西比较
        if (index === 0) {
          indentation = line.search(/\S|$/);
          return;
        }

        // 查看所有剩余的行，找出最小的缩进。
        indentation = Math.min(line.search(/\S|$/), indentation);
      });

    // 再次遍历这些行，删除额外的缩进，将它们连接在一起并返回它
    return lines.map(line => line.substring(indentation)).join('\n');
  }
}
