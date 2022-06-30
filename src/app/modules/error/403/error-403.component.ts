import { Component } from '@angular/core';
import { wsAnimations } from '@ws/animations';
import { AY_50 } from 'app/core/config';

@Component({
  selector: 'error-403',
  templateUrl: './error-403.component.html',
  animations: wsAnimations,
})
export class Error403Component {
  /** 动画配置 */
  AY_50 = AY_50;

  /**
   * 构造函数
   */
  constructor() {}
}
