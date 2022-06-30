import { NgModule } from '@angular/core';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';

@NgModule({
  imports: [
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: {
          ...tooltipVariation,
          arrow: true,
          offset: [0, 10],
        },
        popper: popperVariation,
      },
    }),
  ],
  exports: [TippyModule],
})
export class WsTippyModule {}
