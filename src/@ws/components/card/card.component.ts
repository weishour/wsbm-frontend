import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { wsAnimations } from '@ws/animations';
import { WsCardFace } from '@ws/components/card/card.types';

@Component({
  selector: 'ws-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
  exportAs: 'wsCard',
})
export class WsCardComponent implements OnChanges {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_expanded: BooleanInput;
  static ngAcceptInputType_flippable: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  // 是否可展开
  @Input() expanded: boolean = false;
  // 翻转面对方向
  @Input() face: WsCardFace = 'front';
  // 是否可翻转
  @Input() flippable: boolean = false;

  /**
   * 构造函数
   */
  constructor() {}

  // ----------------------------------------------------------------------------
  // @ 访问器
  // ----------------------------------------------------------------------------

  /**
   * 组件类的HostBinding
   */
  @HostBinding('class') get classList(): any {
    return {
      'ws-card-expanded': this.expanded,
      'ws-card-face-back': this.flippable && this.face === 'back',
      'ws-card-face-front': this.flippable && this.face === 'front',
      'ws-card-flippable': this.flippable,
    };
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 展开
    if ('expanded' in changes) {
      // 将值强制为布尔值
      this.expanded = coerceBooleanProperty(changes.expanded.currentValue);
    }

    // 翻折
    if ('flippable' in changes) {
      // 将值强制为布尔值
      this.flippable = coerceBooleanProperty(changes.flippable.currentValue);
    }
  }
}
