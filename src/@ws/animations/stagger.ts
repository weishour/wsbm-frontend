import { animateChild, query, stagger, transition, trigger } from '@angular/animations';

export function staggerAnimation(timing: number) {
  return trigger(`stagger${timing}`, [
    transition('* => *', [
      query('@*', stagger(timing, animateChild()), { optional: true }),
    ])
  ]);
}

export const stagger80 = staggerAnimation(80);
export const stagger60 = staggerAnimation(60);
export const stagger40 = staggerAnimation(40);
export const stagger20 = staggerAnimation(20);
