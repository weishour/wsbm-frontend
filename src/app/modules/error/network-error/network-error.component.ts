import { Component } from '@angular/core';
import { wsAnimations } from '@ws/animations';
import { AY_50 } from 'app/core/config';

@Component({
  selector: 'network-error',
  templateUrl: './network-error.component.html',
  animations: wsAnimations,
})
export class NetworkErrorComponent {
  /** 动画配置 */
  AY_50 = AY_50;

  /**
   * 构造函数
   */
  constructor() {}
}
