import { NgModule } from '@angular/core';
import { WsUtilsService } from '@ws/services/utils/utils.service';
import { WsColorService } from '@ws/services/utils/color.service';

@NgModule({
  providers: [WsUtilsService, WsColorService],
})
export class WsUtilsModule {}
