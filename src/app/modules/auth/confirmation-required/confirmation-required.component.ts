import { Component, ViewEncapsulation } from '@angular/core';
import { wsAnimations } from '@ws/animations';

@Component({
  selector: 'auth-confirmation-required',
  templateUrl: './confirmation-required.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class AuthConfirmationRequiredComponent {
  /**
   * 构造函数
   */
  constructor() {}
}
