import { NgModule } from '@angular/core';
import { WsFindByKeyPipe } from '@ws/pipes/find-by-key/find-by-key.pipe';

@NgModule({
  declarations: [WsFindByKeyPipe],
  exports: [WsFindByKeyPipe],
})
export class WsFindByKeyPipeModule {}
