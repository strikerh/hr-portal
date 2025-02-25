// file: projects/ngx-side-page/src/lib/side-page.providers.ts
import { Provider } from '@angular/core';
import { SIDE_PAGE_CONFIG,  } from './side-page-config.token';
import {SidePageConfig} from "./side-page.service";

export function provideSidePageConfig(config: SidePageConfig): Provider {
  return { provide: SIDE_PAGE_CONFIG, useValue: config };
}
