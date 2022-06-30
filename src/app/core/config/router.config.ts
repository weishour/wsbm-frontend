import { ExtraOptions } from "@angular/router";
import { QuicklinkStrategy } from 'ngx-quicklink';

export const routerConfig: ExtraOptions = {
  preloadingStrategy: QuicklinkStrategy,
  scrollPositionRestoration: 'enabled',
  relativeLinkResolution: 'legacy',
  anchorScrolling: 'enabled',
  enableTracing: false,
  useHash: true,
};
