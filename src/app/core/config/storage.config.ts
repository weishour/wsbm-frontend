import { StorageConfig } from '@ngx-pwa/local-storage';
import { ILocalStorageServiceConfig } from 'angular-2-local-storage';

export const storageConfig: StorageConfig = {
  LSPrefix: 'WSBM',
  IDBDBName: 'WSBM',
  IDBStoreName: 'localStorage',
};

export const localStorageConfig: ILocalStorageServiceConfig = {
  prefix: '',
  storageType: 'localStorage',
};
