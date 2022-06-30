import {
  animate,
  animateChild,
  AnimationStyleMetadata,
  keyframes,
  query,
  stagger,
  transition,
} from '@angular/animations';

export class WsAnimationDurations {
  static complex = '375ms';
  static entering = '225ms';
  static exiting = '195ms';
}

export class WsAnimationDelays {
  static standard = '0ms';
}

export class WsAnimationCurves {
  static standard = 'cubic-bezier(.4, 0, .2, 1)';
  static deceleration = 'cubic-bezier(0, 0, .2, 1)';
  static acceleration = 'cubic-bezier(.4, 0, 1, 1)';
  static sharp = 'cubic-bezier(.4, 0, .6, 1)';
  static moderation = 'cubic-bezier(.35, 0, .25, 1)';
  static bounce = 'cubic-bezier(.35, 0, .36, 1.25)';
}

/**
 * 动画公共配置
 * @param stateChange
 * @returns
 */
export function WsAnimation(
  stateChange: ':enter' | ':leave',
  steps: AnimationStyleMetadata[],
  options?: Record<string, any> | null,
) {
  let duration =
    stateChange == ':enter' ? WsAnimationDurations.entering : WsAnimationDurations.exiting;
  let curves =
    stateChange == ':enter' ? WsAnimationCurves.deceleration : WsAnimationCurves.acceleration;

  return transition(
    stateChange,
    [
      animate('{{duration}} {{delay}} {{curves}}', keyframes(steps)),
      query('@*', stagger(20, animateChild()), { optional: true }),
    ],
    {
      params: {
        duration, // 持续时间
        delay: WsAnimationDelays.standard, // 延迟时间
        curves, // 动画效果
        ...options, // 其他配置
      },
    },
  );
}
