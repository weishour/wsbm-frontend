import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMasonryComponent } from '@ws/components/masonry/masonry.component';

@NgModule({
  declarations: [WsMasonryComponent],
  imports: [CommonModule],
  exports: [WsMasonryComponent],
})
export class WsMasonryModule {}
