import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { WsAnimation } from '@ws/animations/defaults';

// ----------------------------------------------------------------------------
// @ 淡入
// ----------------------------------------------------------------------------
const fadeIn = trigger('fadeIn',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity: 0,
      }),
      style({
        opacity: 1,
      }),
    ]),
  ]
);

// ----------------------------------------------------------------------------
// @ 从顶部淡入
// ----------------------------------------------------------------------------
const fadeInTop = trigger('fadeInTop',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity: 0,
        transform: 'translate3d(0, {{ y }}, 0)',
      }),
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
    ], { y: '-20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从底部淡入
// ----------------------------------------------------------------------------
const fadeInBottom = trigger('fadeInBottom',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity: 0,
        transform: 'translate3d(0, {{ y }}, 0)',
      }),
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
    ], { y: '20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从左侧淡入
// ----------------------------------------------------------------------------
const fadeInLeft = trigger('fadeInLeft',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity: 0,
        transform: 'translate3d({{ x }}, 0, 0)',
      }),
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
    ], { x: '-20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从右侧淡入
// ----------------------------------------------------------------------------
const fadeInRight = trigger('fadeInRight',
  [
    // 如果状态为false，则阻止转换
    transition('void => false', []),

    // 过渡
    WsAnimation(':enter', [
      style({
        opacity: 0,
        transform: 'translate3d({{ x }}, 0, 0)',
      }),
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
    ], { x: '20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 淡出
// ----------------------------------------------------------------------------
const fadeOut = trigger('fadeOut',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity: 1,
      }),
      style({
        opacity: 0,
      }),
    ]),
  ]
);

// ----------------------------------------------------------------------------
// @ 从顶部淡出
// ----------------------------------------------------------------------------
const fadeOutTop = trigger('fadeOutTop',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
      style({
        opacity: 0,
        transform: 'translate3d(0, {{ y }}, 0)',
      }),
    ], { y: '-20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从底部淡出
// ----------------------------------------------------------------------------
const fadeOutBottom = trigger('fadeOutBottom',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
      style({
        opacity: 0,
        transform: 'translate3d(0, {{ y }}, 0)',
      }),
    ], { y: '20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从左侧淡出
// ----------------------------------------------------------------------------
const fadeOutLeft = trigger('fadeOutLeft',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
      style({
        opacity: 0,
        transform: 'translate3d({{ x }}, 0, 0)',
      }),
    ], { x: '-20%' }),
  ]
);

// ----------------------------------------------------------------------------
// @ 从右侧淡出
// ----------------------------------------------------------------------------
const fadeOutRight = trigger('fadeOutRight',
  [
    // 如果状态为false，则阻止转换
    transition('false => void', []),

    // 过渡
    WsAnimation(':leave', [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }),
      style({
        opacity: 0,
        transform: 'translate3d({{ x }}, 0, 0)',
      }),
    ], { x: '20%' }),
  ]
);

export { fadeIn, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight, fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight };
