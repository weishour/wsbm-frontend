import { NgModule } from '@angular/core';
import { StorageModule } from '@ngx-pwa/local-storage';
import { storageConfig } from 'app/core/config';

@NgModule({
  imports: [
    StorageModule.forRoot(storageConfig),
  ],
})
export class WsStorageModule { }
