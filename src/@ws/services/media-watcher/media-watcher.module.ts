import { NgModule } from '@angular/core';
import { WsMediaWatcherService } from '@ws/services/media-watcher/media-watcher.service';

@NgModule({
  providers: [WsMediaWatcherService],
})
export class WsMediaWatcherModule {
  /**
   * 构造函数
   */
  constructor(private _wsMediaWatcherService: WsMediaWatcherService) {}
}
