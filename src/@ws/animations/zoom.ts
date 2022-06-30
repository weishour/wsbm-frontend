import { state, style, transition, trigger } from '@angular/animations';
import { WsAnimation } from '@ws/animations/defaults';

// ----------------------------------------------------------------------------
// @ 放大
// ----------------------------------------------------------------------------
const zoomIn = trigger('zoomIn',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity  : 0,
        transform: 'scale(0.5)',
      }),
      style({
        opacity  : 1,
        transform: 'scale(1)',
      }),
    ]),
  ]
);

// ----------------------------------------------------------------------------
// @ 缩小
// ----------------------------------------------------------------------------
const zoomOut = trigger('zoomOut',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity  : 0,
        transform: 'scale(1)',
      }),
      style({
        opacity  : 1,
        transform: 'scale(0.5)',
      }),
    ]),
  ]
);

export { zoomIn, zoomOut };

