import { state, style, transition, trigger } from '@angular/animations';
import { WsAnimation } from '@ws/animations/defaults';

// ----------------------------------------------------------------------------
// @ 从顶部滑入
// ----------------------------------------------------------------------------
const slideInTop = trigger('slideInTop',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        transform: 'translate3d(0, {{ y }}, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 1
      }),
    ], { y: '-100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从底部滑入
// ----------------------------------------------------------------------------
const slideInBottom = trigger('slideInBottom',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        transform: 'translate3d(0, {{ y }}, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 1
      }),
    ], { y: '100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从左侧滑入
// ----------------------------------------------------------------------------
const slideInLeft = trigger('slideInLeft',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        transform: 'translate3d({{ x }}, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 1
      }),
    ], { x: '-100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从右侧滑入
// ----------------------------------------------------------------------------
const slideInRight = trigger('slideInRight',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        transform: 'translate3d({{ x }}, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 1
      }),
    ], { x: '100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从顶部滑出
// ----------------------------------------------------------------------------
const slideOutTop = trigger('slideOutTop',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, {{ y }}, 0)',
        offset: 1
      }),
    ], { y: '-100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从底部滑出
// ----------------------------------------------------------------------------
const slideOutBottom = trigger('slideOutBottom',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d(0, {{ y }}, 0)',
        offset: 1
      }),
    ], { y: '100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从左侧滑出
// ----------------------------------------------------------------------------
const slideOutLeft = trigger('slideOutLeft',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d({{ x }}, 0, 0)',
        offset: 1
      }),
    ], { x: '-100%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从右侧滑出
// ----------------------------------------------------------------------------
const slideOutRight = trigger('slideOutRight',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        transform: 'translate3d(0, 0, 0)',
        offset: 0
      }),
      style({
        transform: 'translate3d({{ x }}, 0, 0)',
        offset: 1
      }),
    ], { x: '100%' }),
  ]
);

export { slideInTop, slideInBottom, slideInLeft, slideInRight, slideOutTop, slideOutBottom, slideOutLeft, slideOutRight };
