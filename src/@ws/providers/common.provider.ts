import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const LOCATION_PROVIDES = [
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  }
];
