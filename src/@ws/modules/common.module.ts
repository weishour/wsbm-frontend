
import { LocalStorageModule } from 'angular-2-local-storage';
import { localStorageConfig } from 'app/core/config';
import { MarkdownModule } from 'ngx-markdown';

export const THIRD_MODULES = [
  LocalStorageModule.forRoot(localStorageConfig),
  MarkdownModule.forRoot({}),
];
