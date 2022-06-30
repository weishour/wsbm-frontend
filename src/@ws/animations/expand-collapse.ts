import { animate, state, style, transition, trigger } from '@angular/animations';
import { WsAnimationCurves, WsAnimationDurations } from '@ws/animations/defaults';

// ----------------------------------------------------------------------------
// @ 展开/折叠
// ----------------------------------------------------------------------------
const expandCollapse = trigger('expandCollapse',
  [
    state('void, collapsed',
      style({
        height: '0'
      })
    ),

    state('*, expanded',
      style('*')
    ),

    // 如果状态为false，则阻止转换
    transition('void <=> false, collapsed <=> false, expanded <=> false', []),

    // 过渡
    transition('void <=> *, collapsed <=> expanded',
      animate('{{timings}}'),
      {
        params: {
          timings: `${WsAnimationDurations.entering} ${WsAnimationCurves.deceleration}`
        }
      }
    )
  ]
);

export { expandCollapse };
